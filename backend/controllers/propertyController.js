const { Property, Owner, Booking, Favorite } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for property photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/property-photos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Create property (Owner)
const createProperty = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      location,
      city,
      state,
      country,
      price,
      bedrooms,
      bathrooms,
      amenities,
      maxGuests,
      availableFrom,
      availableTo,
      images
    } = req.body;

    const ownerId = req.user.id;

    const property = await Property.create({
      name,
      type,
      description,
      location,
      city,
      state,
      country,
      price,
      bedrooms,
      bathrooms,
      amenities,
      maxGuests,
      availableFrom,
      availableTo,
      images: images ? JSON.parse(images) : [],
      ownerId
    });

    // Include owner details in response
    const propertyWithOwner = await Property.findByPk(property.id, {
      include: [
        {
          model: Owner,
          as: 'owner',
          attributes: ['id', 'name', 'location']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property: propertyWithOwner
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property'
    });
  }
};

// Get all properties (public)
const getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const properties = await Property.findAndCountAll({
      where: { isActive: true },
      include: [
        {
          model: Owner,
          as: 'owner',
          attributes: ['id', 'name', 'location']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      properties: properties.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(properties.count / limit),
        totalItems: properties.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get properties'
    });
  }
};

// Get property by ID (public)
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: [
        {
          model: Owner,
          as: 'owner',
          attributes: ['id', 'name', 'location', 'phone']
        }
      ]
    });

    if (!property || !property.isActive) {
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
    console.error('Get property by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get property'
    });
  }
};

// Get owner's properties
const getOwnerProperties = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const properties = await Property.findAll({
      where: { ownerId },
      include: [
        {
          model: Owner,
          as: 'owner',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Get owner properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get properties'
    });
  }
};

// Update property (Owner)
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    const property = await Property.findOne({
      where: { id, ownerId }
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or not authorized'
      });
    }

    const {
      name,
      type,
      description,
      location,
      city,
      state,
      country,
      price,
      bedrooms,
      bathrooms,
      amenities,
      maxGuests,
      availableFrom,
      availableTo,
      images
    } = req.body;

    await property.update({
      name: name || property.name,
      type: type || property.type,
      description: description || property.description,
      location: location || property.location,
      city: city || property.city,
      state: state || property.state,
      country: country || property.country,
      price: price || property.price,
      bedrooms: bedrooms || property.bedrooms,
      bathrooms: bathrooms,
      amenities: amenities || property.amenities,
      maxGuests: maxGuests || property.maxGuests,
      availableFrom: availableFrom || property.availableFrom,
      availableTo: availableTo || property.availableTo,
      images: images || property.images
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property'
    });
  }
};

// Delete property (Owner)
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;


    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const property = await Property.findOne({
      where: { id, ownerId }
    });


    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or not authorized'
      });
    }

    // Check if property has active bookings
    const activeBookings = await Booking.count({
      where: {
        propertyId: id,
        status: ['PENDING', 'ACCEPTED']
      }
    });


    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete property with active bookings'
      });
    }

    
    // Delete related records first
    try {
      // Delete all favorites for this property
      await Favorite.destroy({
        where: { propertyId: id }
      });
      
      // Delete all bookings for this property (cancelled bookings are safe to delete)
      await Booking.destroy({
        where: { propertyId: id }
      });
      
      // Now delete the property
      await property.destroy();
    } catch (deleteError) {
      console.error('Error during property deletion:', deleteError);
      throw deleteError;
    }

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property'
    });
  }
};

// Search properties
const searchProperties = async (req, res) => {
  try {
    const { location, startDate, endDate, guests, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      isActive: true
    };

    // Location filter
    if (location) {
      // Handle city, state combinations like "Fremont,CA" or "San Francisco, CA"
      const locationParts = location.split(',').map(part => part.trim());
      
      if (locationParts.length > 1) {
        // For comma-separated searches like "Fremont,CA", search for BOTH city AND state
        const city = locationParts[0];
        const state = locationParts[1];
        
        whereClause[Op.and] = [
          {
            [Op.or]: [
              { city: { [Op.like]: `%${city}%` } },
              { location: { [Op.like]: `%${city}%` } }
            ]
          },
          {
            [Op.or]: [
              { state: { [Op.like]: `%${state}%` } },
              { location: { [Op.like]: `%${state}%` } }
            ]
          }
        ];
      } else {
        // For single term searches, search across all location fields
        whereClause[Op.or] = [
          { city: { [Op.like]: `%${location}%` } },
          { location: { [Op.like]: `%${location}%` } },
          { state: { [Op.like]: `%${location}%` } },
          { country: { [Op.like]: `%${location}%` } }
        ];
      }
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

    const properties = await Property.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Owner,
          as: 'owner',
          attributes: ['id', 'name', 'location']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      properties: properties.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(properties.count / limit),
        totalItems: properties.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search properties'
    });
  }
};

// Upload property photos
const uploadPropertyPhotos = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { propertyId } = req.params;
    const ownerId = req.user.id;
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

    // Check if property belongs to owner
    const property = await Property.findOne({
      where: { id: propertyId, ownerId }
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or not authorized'
      });
    }

    // Generate URLs for uploaded files
    const photoUrls = req.files.map(file => 
      `${baseUrl}/uploads/property-photos/${file.filename}`
    );

    // Update property with new photos
    const currentImages = property.images || [];
    const replaceImages = req.query.replace === 'true';
    
    let updatedImages;
    if (replaceImages) {
      // Replace all images with new ones
      updatedImages = photoUrls;
    } else {
      // Append new photos to existing ones
      updatedImages = [...currentImages, ...photoUrls];
    }
    
    await property.update({ images: updatedImages });

    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      photos: photoUrls,
      totalPhotos: updatedImages.length
    });
  } catch (error) {
    console.error('Upload property photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photos'
    });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  getOwnerProperties,
  updateProperty,
  deleteProperty,
  searchProperties,
  uploadPropertyPhotos,
  upload // Export multer instance
};
