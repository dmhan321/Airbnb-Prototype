const axios = require('axios');
const { Booking, Property } = require('../../shared/models/mongoose');
const { transformDocument, transformDocuments, transformNested } = require('../../shared/utils/transform');

// Property service URL for validation
const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://localhost:5003';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:5004';

// Get owner bookings
const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.userId || req.user._id.toString();
    const mongoose = require('mongoose');
    const ownerObjectId = mongoose.Types.ObjectId.isValid(ownerId)
      ? new mongoose.Types.ObjectId(ownerId)
      : ownerId;

    // Get owner's property IDs
    const properties = await Property.find({ ownerId: ownerObjectId }).select('_id');
    const propertyIds = properties.map(p => p._id);

    if (propertyIds.length === 0) {
      return res.json({
        success: true,
        bookings: []
      });
    }

    // Get bookings for owner's properties
    const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
      .populate({
        path: 'propertyId',
        select: 'name location city state country price photos'
      })
      .populate({
        path: 'travelerId',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Transform bookings
    const transformedBookings = bookings.map(booking => {
      const transformed = transformDocument(booking);
      // REJECTED status is now treated as CANCELLED, but keep this for backwards compatibility
      if (transformed.status === 'REJECTED') {
        transformed.status = 'CANCELLED';
      }
      return transformed;
    });

    res.json({
      success: true,
      bookings: transformedBookings
    });
  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings'
    });
  }
};

// Accept booking
const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.userId || req.user._id.toString();
    const mongoose = require('mongoose');

    const booking = await Booking.findById(id)
      .populate('propertyId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify owner owns the property
    // Convert both to strings for comparison
    const propertyOwnerId = booking.propertyId.ownerId?.toString() || booking.propertyId.ownerId?.toString();
    const ownerIdStr = ownerId.toString();
    
    
    if (propertyOwnerId !== ownerIdStr) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to accept this booking'
      });
    }

    // Check if booking is in pending status
    if (booking.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept booking with status: ${booking.status}`
      });
    }

    // Update booking status
    booking.status = 'ACCEPTED';
    await booking.save();

    const transformed = transformDocument(booking);

    res.json({
      success: true,
      message: 'Booking accepted successfully',
      booking: transformed
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept booking'
    });
  }
};

// Reject booking (treats as cancel - sets status to CANCELLED)
const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.userId || req.user._id.toString();
    const mongoose = require('mongoose');

    const booking = await Booking.findById(id)
      .populate('propertyId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify owner owns the property
    // Convert both to strings for comparison
    const propertyOwnerId = booking.propertyId.ownerId?.toString() || booking.propertyId.ownerId?.toString();
    const ownerIdStr = ownerId.toString();
    
    
    if (propertyOwnerId !== ownerIdStr) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to reject this booking'
      });
    }

    // Check if booking can be cancelled/rejected
    if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update booking status to CANCELLED (treat reject as cancel)
    booking.status = 'CANCELLED';
    await booking.save();

    const transformed = transformDocument(booking);

    res.json({
      success: true,
      message: 'Booking rejected successfully',
      booking: transformed
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel booking (owner side)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.userId || req.user._id.toString();
    const mongoose = require('mongoose');

    const booking = await Booking.findById(id)
      .populate('propertyId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify owner owns the property
    // Convert both to strings for comparison
    const propertyOwnerId = booking.propertyId.ownerId?.toString() || booking.propertyId.ownerId?.toString();
    const ownerIdStr = ownerId.toString();
    
    if (propertyOwnerId !== ownerIdStr) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update booking status
    booking.status = 'CANCELLED';
    await booking.save();

    const transformed = transformDocument(booking);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: transformed
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};

module.exports = {
  getOwnerBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking
};

