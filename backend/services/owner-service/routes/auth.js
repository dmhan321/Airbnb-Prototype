const express = require('express');
const router = express.Router();
const {
  registerOwner,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  upload
} = require('../controllers/authController');
const {
  validateOwnerRegistration,
  validateLogin
} = require('../../shared/middleware/validation');
const { getCurrentUser, requireAuth } = require('../../shared/middleware/authMiddleware'); 

// Public routes
router.post('/register/owner', validateOwnerRegistration, registerOwner);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', requireAuth, getCurrentUser, getProfile);
router.put('/profile', requireAuth, getCurrentUser, updateProfile);
router.put('/change-password', requireAuth, getCurrentUser, changePassword);
router.post('/upload-profile-picture', requireAuth, getCurrentUser, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;

