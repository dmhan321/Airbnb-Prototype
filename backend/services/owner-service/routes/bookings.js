const express = require('express');
const router = express.Router();
const {
  getOwnerBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { requireAuth, requireOwner, getCurrentUser } = require('../../shared/middleware/authMiddleware');

// All routes require authentication and owner access
router.use(requireAuth);
router.use(requireOwner);
router.use(getCurrentUser);

// Owner booking routes
router.get('/owner', getOwnerBookings);
router.put('/:id/accept', acceptBooking);
router.put('/:id/reject', rejectBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

