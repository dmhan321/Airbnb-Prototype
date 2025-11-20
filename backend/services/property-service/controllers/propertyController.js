const { Property, Owner, Booking, Favorite } = require('../../shared/models/mongoose');
const { transformDocument, transformDocuments, transformNested } = require('../../shared/utils/transform');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for property photo uploads
// Use persistent volume mount path if available, otherwise fallback to relative path
const UPLOADS_BASE_DIR = process.env.UPLOADS_DIR || '/app/uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(UPLOADS_BASE_DIR, 'property-photos');
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

    const ownerId = req.userId || req.user._id.toString();

    const property = new Property({
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
      availableFrom: availableFrom ? new Date(availableFrom) : undefined,
      availableTo: availableTo ? new Date(availableTo) : undefined,
      images: images ? (typeof images === 'string' ? JSON.parse(images) : images) : [],
      ownerId
    });
    await property.save();

    // Include owner details in response
    const propertyWithOwner = await Property.findById(property._id)
      .populate('ownerId', 'name location');

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property: transformNested(propertyWithOwner)
    });
  } catch (error) {
    console.error('Create property error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all properties (public)
const getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const properties = await Property.find({ isActive: true })
      .populate('ownerId', 'name location')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Property.countDocuments({ isActive: true });

    res.json({
      success: true,
      properties: transformDocuments(properties),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
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
    const mongoose = require('mongoose');

    // Validate property ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findById(id)
      .populate('ownerId', 'name location phone profilePicture createdAt')
      .lean();

    if (!property || !property.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const transformedProperty = transformNested(property);

    res.json({
      success: true,
      property: transformedProperty
    });
  } catch (error) {
    console.error('Get property by ID error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get property',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get owner's properties
const getOwnerProperties = async (req, res) => {
  try {
    const ownerId = req.userId || req.user._id.toString();

    const properties = await Property.find({ ownerId })
      .populate('ownerId', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      properties: transformDocuments(properties)
    });
  } catch (error) {
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
    const ownerId = req.userId || (req.user ? req.user._id.toString() : null);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    const propertyOwnerId = property.ownerId.toString();
    const currentOwnerId = ownerId.toString();

    if (propertyOwnerId !== currentOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
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

    if (name) property.name = name;
    if (type) property.type = type;
    if (description !== undefined) property.description = description;
    if (location) property.location = location;
    if (city) property.city = city;
    if (state !== undefined) property.state = state;
    if (country) property.country = country;
    if (price) property.price = price;
    if (bedrooms !== undefined) property.bedrooms = bedrooms;
    if (bathrooms !== undefined) property.bathrooms = bathrooms;
    if (amenities !== undefined) property.amenities = amenities;
    if (maxGuests) property.maxGuests = maxGuests;
    if (availableFrom) property.availableFrom = new Date(availableFrom);
    if (availableTo) property.availableTo = new Date(availableTo);
    // Only update images if explicitly provided (preserve existing if not sent)
    if (images !== undefined && images !== null) {
      property.images = typeof images === 'string' ? JSON.parse(images) : images;
    }

    await property.save();

    // Reload property with populated fields
    const updatedProperty = await Property.findById(property._id)
      .populate('ownerId', 'name location');

    res.json({
      success: true,
      message: 'Property updated successfully',
      property: transformNested(updatedProperty)
    });
  } catch (error) {
    console.error('Update property error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete property (Owner)
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.userId || (req.user ? req.user._id.toString() : null);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const property = await Property.findOne({
      _id: id,
      ownerId
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or not authorized'
      });
    }

    // Check if property has active bookings
    const activeBookings = await Booking.countDocuments({
      propertyId: id,
      status: { $in: ['PENDING', 'ACCEPTED'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete property with active bookings'
      });
    }

    // Delete related records first
    try {
      await Favorite.deleteMany({ propertyId: id });
      await Booking.deleteMany({ propertyId: id });
      await Property.findByIdAndDelete(id);
    } catch (deleteError) {
      throw deleteError;
    }

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
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
    const skip = (page - 1) * limit;

    const query = {
      isActive: true
    };

    // Location filter
    if (location) {
      const locationParts = location.split(',').map(part => part.trim());
      
      if (locationParts.length > 1) {
        const city = locationParts[0];
        const state = locationParts[1];
        
        query.$and = [
          {
            $or: [
              { city: { $regex: city, $options: 'i' } },
              { location: { $regex: city, $options: 'i' } }
            ]
          },
          {
            $or: [
              { state: { $regex: state, $options: 'i' } },
              { location: { $regex: state, $options: 'i' } }
            ]
          }
        ];
      } else {
        query.$or = [
          { city: { $regex: location, $options: 'i' } },
          { location: { $regex: location, $options: 'i' } },
          { state: { $regex: location, $options: 'i' } },
          { country: { $regex: location, $options: 'i' } }
        ];
      }
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Guest capacity filter
    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    const properties = await Property.find(query)
      .populate('ownerId', 'name location')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Property.countDocuments(query);

    // Filter by availability dates if provided
    let filteredProperties = properties;
    if (startDate && endDate) {
      filteredProperties = properties.filter(property => {
        const propertyStart = property.availableFrom ? new Date(property.availableFrom) : new Date(0);
        const propertyEnd = property.availableTo ? new Date(property.availableTo) : new Date('2099-12-31');
        const searchStart = new Date(startDate);
        const searchEnd = new Date(endDate);
        
        return searchStart >= propertyStart && searchEnd <= propertyEnd;
      });
    }

    res.json({
      success: true,
      properties: transformDocuments(filteredProperties),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
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
    const { propertyId } = req.params; // Get from URL params, not body
    const files = req.files || [];
    const ownerId = req.userId || req.user._id.toString();

    if (!propertyId) {
      // Delete uploaded files if propertyId is missing
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      // Delete uploaded files if propertyId is invalid
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      // Delete uploaded files if property not found
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    const propertyOwnerId = property.ownerId.toString();
    const currentOwnerId = ownerId.toString();

    if (propertyOwnerId !== currentOwnerId) {
      // Delete uploaded files if not authorized
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload photos for this property'
      });
    }

    // Process uploaded files
    const uploadedPhotos = [];
    // Use PUBLIC_PROPERTY_SERVICE_URL for browser-accessible URLs, fallback to PROPERTY_SERVICE_URL
    const PUBLIC_PROPERTY_SERVICE_URL = process.env.PUBLIC_PROPERTY_SERVICE_URL || process.env.PROPERTY_SERVICE_URL || 'http://localhost:5003';
    
    files.forEach(file => {
      // Construct URL for the uploaded photo (use public URL so browser can access it)
      const photoUrl = `${PUBLIC_PROPERTY_SERVICE_URL}/uploads/property-photos/${file.filename}`;
      uploadedPhotos.push(photoUrl);
    });

    // Add new photos to existing images array
    if (!property.images) {
      property.images = [];
    }
    property.images = [...property.images, ...uploadedPhotos];
    await property.save();

    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      photos: uploadedPhotos
    });
  } catch (error) {
    console.error('Upload property photos error:', error);
    // Delete uploaded files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
          }
        }
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload photos',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
  upload
};

