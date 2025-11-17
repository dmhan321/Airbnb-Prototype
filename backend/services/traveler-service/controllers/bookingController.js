const axios = require('axios');
const { Traveler } = require('../../shared/models/mongoose');
const { parseDateUTC, getTodayUTC } = require('../../shared/utils/dateUtils');
const { publishBookingRequest } = require('../kafka/bookingProducer');

// Property service URL for validation
// Use internal Docker network name for service-to-service communication
const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://property-service:5003';

/**
 * Create booking request via Kafka (Traveler Service)
 * This publishes to Kafka instead of creating directly in DB
 */
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

    // Validate dates
    const startMidnight = parseDateUTC(startDate);
    const endMidnight = parseDateUTC(endDate);
    const todayUTC = getTodayUTC();

    if (!startMidnight || !endMidnight || isNaN(startMidnight.getTime()) || isNaN(endMidnight.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format.'
      });
    }

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

    // Get property details (for ownerId and price calculation)
    try {
      const propertyResponse = await axios.get(`${PROPERTY_SERVICE_URL}/api/properties/${propertyId}`);
      const property = propertyResponse.data.property;

      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }

      // Calculate total price
      const nights = Math.ceil((endMidnight - startMidnight) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * (property.price || 0);

      // Prepare booking data for Kafka
      const bookingData = {
        travelerId,
        propertyId,
        ownerId: property.ownerId || property.ownerId?._id || property.ownerId?.id,
        startDate: startMidnight.toISOString(),
        endDate: endMidnight.toISOString(),
        guests,
        totalPrice
      };

      // Publish to Kafka
      await publishBookingRequest(bookingData);

      // Return immediately with pending status
      // The actual booking will be created by the booking service consumer
      res.status(202).json({
        success: true,
        message: 'Booking request submitted. Processing...',
        booking: {
          propertyId,
          startDate: startDate,
          endDate: endDate,
          guests,
          totalPrice,
          status: 'PENDING',
          note: 'Booking is being processed asynchronously via Kafka'
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Create booking error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createBooking
};

