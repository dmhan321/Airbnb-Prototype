const express = require('express');
const router = express.Router();
const {
  createBooking,
  getTravelerBookings,
  getOwnerBookings,
  acceptBooking,
  cancelBooking,
  getPropertyBlockedDates,
  autoCompleteBookings
} = require('../controllers/bookingController');
const { requireAuth, requireTraveler, requireOwner, getCurrentUser } = require('../middleware/authMiddleware');
const { validateBooking } = require('../middleware/validation');

// Public routes (no authentication required)
router.get('/property/:propertyId/blocked-dates', getPropertyBlockedDates);

// All other routes require authentication
router.use(requireAuth);

// Auto-complete bookings (admin route)
router.post('/auto-complete', async (req, res) => {
  try {
    const completedCount = await autoCompleteBookings();
    res.json({
      success: true,
      message: `Auto-completed ${completedCount} bookings`,
      completedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to auto-complete bookings',
      error: error.message
    });
  }
});

// Traveler routes
router.post('/', requireTraveler, getCurrentUser, validateBooking, createBooking);
router.get('/traveler', requireTraveler, getCurrentUser, getTravelerBookings);

// Owner routes
router.get('/owner', requireOwner, getCurrentUser, getOwnerBookings);
router.put('/:id/accept', requireOwner, getCurrentUser, acceptBooking);

// Both traveler and owner can cancel bookings
router.put('/:id/cancel', getCurrentUser, cancelBooking);

module.exports = router;
