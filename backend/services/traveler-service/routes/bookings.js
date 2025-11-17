const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { requireAuth, requireTraveler, getCurrentUser } = require('../../shared/middleware/authMiddleware');

// Protected routes (traveler only)
router.post('/', requireAuth, requireTraveler, getCurrentUser, createBooking);

module.exports = router;

