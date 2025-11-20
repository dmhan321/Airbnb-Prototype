const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile,
  uploadProfilePicture
} = require('../controllers/travelerController');
const { requireAuth, requireTraveler, getCurrentUser } = require('../../shared/middleware/authMiddleware');

// ==============================
// Multer Setup for Profile Pics
// ==============================
const fs = require('fs');
// Use persistent volume mount path if available, otherwise fallback to relative path
const UPLOADS_BASE_DIR = process.env.UPLOADS_DIR || '/app/uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to profile-pictures subdirectory to match the URL structure
    const uploadDir = path.join(UPLOADS_BASE_DIR, 'profile-pictures');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
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

module.exports = router;

