const express = require('express');
const router = express.Router();
const {
  createBooking,
  getTravelerBookings,
  cancelBooking,
  getPropertyBlockedDates
} = require('../controllers/bookingController');
const { requireAuth, requireTraveler, getCurrentUser } = require('../../shared/middleware/authMiddleware');

// Public routes
router.get('/property/:propertyId/blocked-dates', getPropertyBlockedDates);

// Protected routes (traveler only)
router.post('/', requireAuth, requireTraveler, getCurrentUser, createBooking);
router.get('/traveler', requireAuth, requireTraveler, getCurrentUser, getTravelerBookings);
router.put('/:id/cancel', requireAuth, requireTraveler, getCurrentUser, cancelBooking);

module.exports = router;

