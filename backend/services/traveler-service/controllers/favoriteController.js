const axios = require('axios');
const { Favorite, Property } = require('../../shared/models/mongoose');
const { transformDocument, transformNested } = require('../../shared/utils/transform');

// Property service URL for validation
const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://localhost:5003';

// Add property to favorites
const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const travelerId = req.userId || (req.user ? req.user._id.toString() : null);

    if (!travelerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Validate property ID
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    // Check if property exists (call property service or direct DB query)
    // Using direct DB query for simplicity
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Convert IDs to ObjectId for comparison
    const travelerObjectId = mongoose.Types.ObjectId.isValid(travelerId) 
      ? new mongoose.Types.ObjectId(travelerId) 
      : travelerId;
    const propertyObjectId = mongoose.Types.ObjectId.isValid(propertyId)
      ? new mongoose.Types.ObjectId(propertyId)
      : propertyId;

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      travelerId: travelerObjectId,
      propertyId: propertyObjectId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }

    // Add to favorites
    const favorite = new Favorite({
      travelerId: travelerObjectId,
      propertyId: propertyObjectId
    });
    await favorite.save();

    // Include property details in response
    const favoriteWithProperty = await Favorite.findById(favorite._id)
      .populate({
        path: 'propertyId',
        populate: {
          path: 'ownerId',
          select: 'name location'
        }
      })
      .lean();

    // Transform: convert propertyId to property for frontend compatibility
    const transformed = transformDocument(favoriteWithProperty);
    if (transformed.propertyId) {
      transformed.property = transformNested(transformed.propertyId);
      delete transformed.propertyId;
    }

    res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      favorite: transformed
    });
  } catch (error) {
    console.error('Add favorite error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add to favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get traveler's favorites
const getFavorites = async (req, res) => {
  try {
    const travelerId = req.userId || (req.user ? req.user._id.toString() : null);

    if (!travelerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const mongoose = require('mongoose');
    const travelerObjectId = mongoose.Types.ObjectId.isValid(travelerId)
      ? new mongoose.Types.ObjectId(travelerId)
      : travelerId;

    const favorites = await Favorite.find({ travelerId: travelerObjectId })
      .populate({
        path: 'propertyId',
        populate: {
          path: 'ownerId',
          select: 'name location'
        }
      })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() to get plain objects

    // Transform favorites: convert propertyId to property for frontend compatibility
    const transformedFavorites = favorites.map(favorite => {
      const transformed = transformDocument(favorite);
      // Rename propertyId to property for frontend compatibility
      if (transformed.propertyId) {
        transformed.property = transformNested(transformed.propertyId);
        delete transformed.propertyId;
      }
      return transformed;
    });

    res.json({
      success: true,
      favorites: transformedFavorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get favorites'
    });
  }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const travelerId = req.userId || (req.user ? req.user._id.toString() : null);

    if (!travelerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const mongoose = require('mongoose');
    const travelerObjectId = mongoose.Types.ObjectId.isValid(travelerId)
      ? new mongoose.Types.ObjectId(travelerId)
      : travelerId;

    // Try to find by favorite ID first
    let favorite;
    if (mongoose.Types.ObjectId.isValid(id)) {
      favorite = await Favorite.findOne({
        _id: id,
        travelerId: travelerObjectId
      });
    }

    // If not found by ID, try to find by propertyId
    if (!favorite) {
      const propertyObjectId = mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : id;
      favorite = await Favorite.findOne({
        propertyId: propertyObjectId,
        travelerId: travelerObjectId
      });
    }

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    await Favorite.findByIdAndDelete(favorite._id);

    res.json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Check if property is in favorites
const checkFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const travelerId = req.userId || (req.user ? req.user._id.toString() : null);

    if (!travelerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const travelerObjectId = mongoose.Types.ObjectId.isValid(travelerId)
      ? new mongoose.Types.ObjectId(travelerId)
      : travelerId;
    const propertyObjectId = mongoose.Types.ObjectId.isValid(propertyId)
      ? new mongoose.Types.ObjectId(propertyId)
      : propertyId;

    const favorite = await Favorite.findOne({
      travelerId: travelerObjectId,
      propertyId: propertyObjectId
    });

    res.json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite status'
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
  checkFavorite
};

