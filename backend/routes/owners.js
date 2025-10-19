const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getDashboard
} = require('../controllers/ownerController');
const { requireAuth, requireOwner, getCurrentUser } = require('../middleware/authMiddleware');

// Configure multer for file uploads
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// All routes require authentication and owner access
router.use(requireAuth);
router.use(requireOwner);
router.use(getCurrentUser);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/picture', upload.single('profilePicture'), uploadProfilePicture);

// Dashboard route
router.get('/dashboard', getDashboard);

module.exports = router;
