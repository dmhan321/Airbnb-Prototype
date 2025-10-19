const { Favorite, Property, Traveler } = require('../models');

// Add property to favorites
const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const travelerId = req.user.id;

    // Check if property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      where: { travelerId, propertyId }
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }

    // Add to favorites
    const favorite = await Favorite.create({
      travelerId,
      propertyId
    });

    // Include property details in response
    const favoriteWithProperty = await Favorite.findByPk(favorite.id, {
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: require('../models').Owner,
              as: 'owner',
              attributes: ['id', 'name', 'location']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      favorite: favoriteWithProperty
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to favorites'
    });
  }
};

// Get traveler's favorites
const getFavorites = async (req, res) => {
  try {
    const travelerId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { travelerId },
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: require('../models').Owner,
              as: 'owner',
              attributes: ['id', 'name', 'location']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
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
    const travelerId = req.user.id;

    // Try to find by favorite ID first
    let favorite = await Favorite.findOne({
      where: { id, travelerId }
    });

    // If not found by ID, try to find by propertyId
    if (!favorite) {
      favorite = await Favorite.findOne({
        where: { propertyId: id, travelerId }
      });
    }

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    await favorite.destroy();

    res.json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites'
    });
  }
};

// Check if property is in favorites
const checkFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const travelerId = req.user.id;

    const favorite = await Favorite.findOne({
      where: { travelerId, propertyId }
    });

    res.json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    console.error('Check favorite error:', error);
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
