const express = require('express');
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  getOwnerProperties,
  updateProperty,
  deleteProperty,
  searchProperties,
  uploadPropertyPhotos,
  upload
} = require('../controllers/propertyController');
const { requireAuth, requireOwner, getCurrentUser } = require('../../shared/middleware/authMiddleware');

// Public routes
router.get('/', getAllProperties);
router.get('/search', searchProperties);
router.get('/:id', getPropertyById);

// Protected routes (owner only)
router.post('/', requireAuth, requireOwner, getCurrentUser, createProperty);
router.get('/owner/my-properties', requireAuth, requireOwner, getCurrentUser, getOwnerProperties);
router.put('/:id', requireAuth, requireOwner, getCurrentUser, updateProperty);
router.delete('/:id', requireAuth, requireOwner, getCurrentUser, deleteProperty);
router.post('/:propertyId/photos', requireAuth, requireOwner, getCurrentUser, upload.array('photos', 10), uploadPropertyPhotos);

module.exports = router;

