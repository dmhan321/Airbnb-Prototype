const express = require('express');
const router = express.Router();
const {
  addFavorite,
  getFavorites,
  removeFavorite,
  checkFavorite
} = require('../controllers/favoriteController');
const { requireAuth, requireTraveler, getCurrentUser } = require('../middleware/authMiddleware');

// All routes require authentication and traveler access
router.use(requireAuth);
router.use(requireTraveler);
router.use(getCurrentUser);

// Favorite routes
router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/:id', removeFavorite);
router.get('/check/:propertyId', checkFavorite);

module.exports = router;
