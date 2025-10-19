const bcrypt = require('bcryptjs');
const { Traveler, Property, Booking, Favorite } = require('../models');
const { Op } = require('sequelize');

// Get traveler profile
const getProfile = async (req, res) => {
  try {
    const traveler = await Traveler.findByPk(req.user.id);
    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: 'Traveler not found'
      });
    }

    const userData = { ...traveler.toJSON() };
    delete userData.password;

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Get traveler profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Update traveler profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, aboutMe, city, country, languages, gender } = req.body;
    
    const traveler = await Traveler.findByPk(req.user.id);
    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: 'Traveler not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== traveler.email) {
      const existingTraveler = await Traveler.findOne({ where: { email } });
      if (existingTraveler) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    await traveler.update({
      name: name || traveler.name,
      email: email || traveler.email,
      phone: phone || traveler.phone,
      aboutMe: aboutMe || traveler.aboutMe,
      city: city || traveler.city,
      country: country || traveler.country,
      languages: languages || traveler.languages,
      gender: gender || traveler.gender
    });

    const userData = { ...traveler.toJSON() };
    delete userData.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update traveler profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const traveler = await Traveler.findByPk(req.user.id);
    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: 'Traveler not found'
      });
    }

    const profilePicture = `/uploads/${req.file.filename}`;
    await traveler.update({ profilePicture });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture'
    });
  }
};

// Search properties
const searchProperties = async (req, res) => {
  try {
    const { location, startDate, endDate, guests, minPrice, maxPrice } = req.query;
    
    const whereClause = {
      isActive: true
    };

    // Location filter
    if (location) {
      whereClause[Op.or] = [
        { city: { [Op.like]: `%${location}%` } },
        { location: { [Op.like]: `%${location}%` } },
        { country: { [Op.like]: `%${location}%` } }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }

    // Guest capacity filter
    if (guests) {
      whereClause.maxGuests = { [Op.gte]: guests };
    }

    const properties = await Property.findAll({
      where: whereClause,
      include: [
        {
          model: require('../models').Owner,
          as: 'owner',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Filter by availability dates if provided
    let filteredProperties = properties;
    if (startDate && endDate) {
      filteredProperties = properties.filter(property => {
        // Simple availability check - in real app, check against bookings
        const propertyStart = property.availableFrom ? new Date(property.availableFrom) : new Date(0);
        const propertyEnd = property.availableTo ? new Date(property.availableTo) : new Date('2099-12-31');
        const searchStart = new Date(startDate);
        const searchEnd = new Date(endDate);
        
        return searchStart >= propertyStart && searchEnd <= propertyEnd;
      });
    }

    res.json({
      success: true,
      properties: filteredProperties
    });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search properties'
    });
  }
};

// Get property details
const getPropertyDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findByPk(id, {
      include: [
        {
          model: require('../models').Owner,
          as: 'owner',
          attributes: ['id', 'name', 'location', 'phone']
        }
      ]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Get property details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get property details'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  searchProperties,
  getPropertyDetails
};

