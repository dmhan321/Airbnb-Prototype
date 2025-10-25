const express = require('express');
const router = express.Router();
const {
  registerTraveler,
  registerOwner,
  login,
  logout,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  upload
} = require('../controllers/authController');
const {
  validateTravelerRegistration,
  validateOwnerRegistration,
  validateLogin
} = require('../middleware/validation');
const { getCurrentUser, requireAuth } = require('../middleware/authMiddleware'); 

// Public routes
router.post('/register/traveler', validateTravelerRegistration, registerTraveler);
router.post('/register/owner', validateOwnerRegistration, registerOwner);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', requireAuth, getCurrentUser, getProfile);
router.put('/profile', getCurrentUser, updateProfile);
router.post('/upload-profile-picture', getCurrentUser, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;