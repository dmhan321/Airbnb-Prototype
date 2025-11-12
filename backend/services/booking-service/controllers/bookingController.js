const axios = require('axios');
const { Booking, Property, Traveler } = require('../../shared/models/mongoose');
const { transformDocument, transformDocuments, transformNested } = require('../../shared/utils/transform');
const { parseDateUTC, getTodayUTC, normalizeToUTCMidnight, formatDateUTC } = require('../../shared/utils/dateUtils');

// Property service URL for validation
const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://localhost:5003';

// Auto-complete bookings that have passed their checkout date
const autoCompleteBookings = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await Booking.updateMany(
      {
        status: 'ACCEPTED',
        endDate: { $lt: today }
      },
      {
        $set: { status: 'COMPLETED' }
      }
    );
    
    return result.modifiedCount;
  } catch (error) {
    throw error;
  }
};

// Create booking (Traveler)
const createBooking = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, guests } = req.body;
    const travelerId = req.userId || (req.user ? req.user._id.toString() : null);

    if (!travelerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    if (!guests || guests < 1) {
      return res.status(400).json({
        success: false,
        message: 'Number of guests must be at least 1'
      });
    }

    // Validate dates - Parse as UTC midnight for consistency
    const startMidnight = parseDateUTC(startDate);
    const endMidnight = parseDateUTC(endDate);
    const todayUTC = getTodayUTC();

    if (!startMidnight || !endMidnight || isNaN(startMidnight.getTime()) || isNaN(endMidnight.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format.'
      });
    }

    // Compare dates in UTC to avoid timezone issues
    if (startMidnight < todayUTC) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    if (endMidnight <= startMidnight) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Validate property ID
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format'
      });
    }

    // Convert IDs to ObjectId
    const travelerObjectId = mongoose.Types.ObjectId.isValid(travelerId)
      ? new mongoose.Types.ObjectId(travelerId)
      : travelerId;
    const propertyObjectId = mongoose.Types.ObjectId.isValid(propertyId)
      ? new mongoose.Types.ObjectId(propertyId)
      : propertyId;

    const property = await Property.findById(propertyObjectId);
    if (!property || !property.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or not available'
      });
    }

    // Check if property can accommodate guests
    const numGuests = parseInt(guests);
    if (isNaN(numGuests) || numGuests < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid number of guests'
      });
    }

    if (numGuests > property.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Property can only accommodate ${property.maxGuests} guests, but ${numGuests} were requested`
      });
    }

    // Check for conflicting bookings (date overlap)
    // Two date ranges [start1, end1] and [start2, end2] overlap if:
    // start2 < end1 AND end2 > start1
    // This covers all overlap scenarios:
    // - Partial overlap (start or end within range)
    // - Complete containment (one range inside the other)
    const conflictingBooking = await Booking.findOne({
      propertyId: propertyObjectId,
      status: { $in: ['PENDING', 'ACCEPTED'] },
      // Existing booking overlaps with new booking if:
      // existing.startDate < new.endDate AND existing.endDate > new.startDate
      startDate: { $lt: endMidnight },
      endDate: { $gt: startMidnight }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for the selected dates'
      });
    }

    // Calculate total price - Use UTC dates for accurate calculation
    const nights = Math.ceil((endMidnight - startMidnight) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * nights;

    // Create booking - Store dates as UTC midnight
    const booking = new Booking({
      travelerId: travelerObjectId,
      propertyId: propertyObjectId,
      startDate: startMidnight, // Already UTC midnight
      endDate: endMidnight, // Already UTC midnight
      guests: numGuests,
      totalPrice,
      status: 'PENDING'
    });
    await booking.save();

    // Include property and traveler details in response
    const bookingWithDetails = await Booking.findById(booking._id)
      .populate({
        path: 'propertyId',
        select: 'name location city country price images ownerId',
        populate: {
          path: 'ownerId',
          select: 'name location'
        }
      })
      .populate({
        path: 'travelerId',
        select: 'name email'
      })
      .lean();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: transformNested(bookingWithDetails)
    });
  } catch (error) {
    console.error('Create booking error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get traveler's bookings
const getTravelerBookings = async (req, res) => {
  try {
    // Auto-complete bookings first
    await autoCompleteBookings();
    
    const travelerId = req.userId || req.user._id.toString();

    const bookings = await Booking.find({ travelerId })
      .populate({
        path: 'propertyId',
        select: 'name location city state country price images ownerId',
        populate: {
          path: 'ownerId',
          select: 'name location'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings: transformDocuments(bookings)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings'
    });
  }
};

// Cancel booking (Traveler)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId || (req.user ? req.user._id.toString() : null);
    const userType = req.userType;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (userType !== 'traveler') {
      return res.status(403).json({
        success: false,
        message: 'Only travelers can cancel bookings through this endpoint'
      });
    }

    const booking = await Booking.findById(id).populate('propertyId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const userIdStr = userId.toString();
    const isTraveler = booking.travelerId.toString() === userIdStr;

    if (!isTraveler) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    const transformed = transformDocument(booking);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: transformed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};

// Get blocked dates for a property
const getPropertyBlockedDates = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Get all bookings for this property that are not cancelled
    const bookings = await Booking.find({
      propertyId,
      status: { $in: ['PENDING', 'ACCEPTED'] }
    }).select('startDate endDate');

    // Generate list of blocked dates
    // Note: Checkout date (endDate) is NOT blocked as guest leaves that day
    const blockedDates = [];
    
    bookings.forEach(booking => {
      // Normalize booking dates to UTC midnight
      const start = normalizeToUTCMidnight(booking.startDate);
      const end = normalizeToUTCMidnight(booking.endDate);
      
      // Block all dates from check-in (inclusive) to check-out (exclusive)
      // Checkout day is available for next guest
      // Generate dates in UTC and format as YYYY-MM-DD
      let currentDate = new Date(start);
      while (currentDate < end) {
        const dateString = formatDateUTC(currentDate);
        
        if (!blockedDates.includes(dateString)) {
          blockedDates.push(dateString);
        }
        
        // Move to next day in UTC
        currentDate = new Date(currentDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
    });

    res.json({
      success: true,
      blockedDates: blockedDates.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get blocked dates'
    });
  }
};

module.exports = {
  createBooking,
  getTravelerBookings,
  cancelBooking,
  getPropertyBlockedDates,
  autoCompleteBookings
};

