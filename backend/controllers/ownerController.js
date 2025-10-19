const bcrypt = require('bcryptjs');
const { Owner, Property, Booking } = require('../models');

// Get owner profile
const getProfile = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.user.id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    const userData = { ...owner.toJSON() };
    delete userData.password;

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Get owner profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Update owner profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, location, phone, aboutMe } = req.body;
    
    const owner = await Owner.findByPk(req.user.id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== owner.email) {
      const existingOwner = await Owner.findOne({ where: { email } });
      if (existingOwner) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    await owner.update({
      name: name || owner.name,
      email: email || owner.email,
      location: location || owner.location,
      phone: phone || owner.phone,
      aboutMe: aboutMe || owner.aboutMe
    });

    const userData = { ...owner.toJSON() };
    delete userData.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update owner profile error:', error);
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

    const owner = await Owner.findByPk(req.user.id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    const profilePicture = `/uploads/${req.file.filename}`;
    await owner.update({ profilePicture });

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

// Get owner dashboard
const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get owner's properties
    const properties = await Property.findAll({
      where: { ownerId },
      attributes: ['id', 'name', 'price', 'isActive']
    });

    // Get total bookings for owner's properties
    const propertyIds = properties.map(property => property.id);
    
    let totalBookings = 0;
    let pendingBookings = 0;
    let acceptedBookings = 0;
    let cancelledBookings = 0;
    let totalRevenue = 0;

    if (propertyIds.length > 0) {
      const bookings = await Booking.findAll({
        where: { propertyId: propertyIds },
        attributes: ['status', 'totalPrice']
      });

      totalBookings = bookings.length;
      pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
      acceptedBookings = bookings.filter(b => b.status === 'ACCEPTED').length;
      cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
      totalRevenue = bookings
        .filter(b => b.status === 'ACCEPTED')
        .reduce((sum, b) => sum + parseFloat(b.totalPrice), 0);
    }

    // Get recent bookings
    const recentBookings = await Booking.findAll({
      where: { propertyId: propertyIds },
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name']
        },
        {
          model: require('../models').Traveler,
          as: 'traveler',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      dashboard: {
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.isActive).length,
        totalBookings,
        pendingBookings,
        acceptedBookings,
        cancelledBookings,
        totalRevenue,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Get owner dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getDashboard
};

