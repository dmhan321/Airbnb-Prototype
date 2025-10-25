const express = require('express');
const { Traveler } = require('../models');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  searchProperties,
  getPropertyDetails
} = require('../controllers/travelerController');
const { requireAuth, requireTraveler, getCurrentUser } = require('../middleware/authMiddleware');

// ==============================
// Multer Setup for Profile Pics
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// =======================
// Traveler Public Profile
// (Used by FastAPI Agent)
// =======================
router.get('/:id', async (req, res) => {
  try {
    const traveler = await Traveler.findByPk(req.params.id);
    if (!traveler) {
      return res.status(404).json({ error: 'Traveler not found' });
    }
    res.json(traveler);
  } catch (err) {
    console.error('Traveler fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// ========================
// Global Auth Middleware
// ========================
router.use(requireAuth);
router.use(requireTraveler);
router.use(getCurrentUser);

// =======================
// Profile Management
// =======================
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/picture', upload.single('profilePicture'), uploadProfilePicture);

// =======================
// Property Search
// =======================
router.get('/properties/search', searchProperties);
router.get('/properties/:id', getPropertyDetails);

module.exports = router;