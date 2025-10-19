const express = require('express');
const router = express.Router();
const {
  createBooking,
  getTravelerBookings,
  getOwnerBookings,
  acceptBooking,
  cancelBooking,
  getPropertyBlockedDates
} = require('../controllers/bookingController');
const { requireAuth, requireTraveler, requireOwner, getCurrentUser } = require('../middleware/authMiddleware');
const { validateBooking } = require('../middleware/validation');

// All routes require authentication
router.use(requireAuth);

// Traveler routes
router.post('/', requireTraveler, getCurrentUser, validateBooking, createBooking);
router.get('/traveler', requireTraveler, getCurrentUser, getTravelerBookings);

// Owner routes
router.get('/owner', requireOwner, getCurrentUser, getOwnerBookings);
router.put('/:id/accept', requireOwner, getCurrentUser, acceptBooking);

// Both traveler and owner can cancel bookings
router.put('/:id/cancel', getCurrentUser, cancelBooking);

// Get blocked dates for a property (public route)
router.get('/property/:propertyId/blocked-dates', getPropertyBlockedDates);

module.exports = router;
