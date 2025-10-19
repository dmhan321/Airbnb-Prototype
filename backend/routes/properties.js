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
const { requireAuth, requireOwner, getCurrentUser } = require('../middleware/authMiddleware');
const { validateProperty } = require('../middleware/validation');

// Public routes
router.get('/', getAllProperties);
router.get('/search', searchProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.use(requireAuth);

// Owner-only routes
router.post('/', requireOwner, getCurrentUser, validateProperty, createProperty);
router.get('/owner/properties', requireOwner, getCurrentUser, getOwnerProperties);
router.put('/:id', requireOwner, getCurrentUser, updateProperty);
router.delete('/:id', requireOwner, getCurrentUser, deleteProperty);
router.post('/:propertyId/photos', requireOwner, getCurrentUser, upload.array('photos', 10), uploadPropertyPhotos);

module.exports = router;
