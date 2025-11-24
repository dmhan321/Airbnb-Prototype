const { Owner, Property, Booking } = require('../../shared/models/mongoose');
const { transformDocument } = require('../../shared/utils/transform');

// Get owner profile
const getProfile = async (req, res) => {
  try {
    // Fetch fresh user data from database to ensure we have the latest profile picture
    const userId = req.userId || req.user._id;
    const mongoose = require('mongoose');
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;
    
    const owner = await Owner.findById(userObjectId);
    
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    const userData = transformDocument(owner);
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
    const { name, email, location, phone, aboutMe, address, city, state, country, languages, gender } = req.body;
    
    const owner = await Owner.findById(req.userId || req.user._id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== owner.email) {
      const existingOwner = await Owner.findOne({ email: email.toLowerCase() });
      if (existingOwner) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    if (name) owner.name = name;
    if (email) owner.email = email.toLowerCase();
    if (location !== undefined) owner.location = location;
    if (phone !== undefined) owner.phone = phone;
    if (aboutMe !== undefined) owner.aboutMe = aboutMe;
    if (address !== undefined) owner.address = address;
    if (city !== undefined) owner.city = city;
    if (state !== undefined) owner.state = state;
    if (country !== undefined) owner.country = country;
    if (languages !== undefined) owner.languages = languages;
    if (gender !== undefined) owner.gender = gender;
    
    // Only update profilePicture if explicitly provided (not undefined)
    // This prevents clearing the picture when updating other fields
    const { profilePicture } = req.body;
    if (profilePicture !== undefined) {
      owner.profilePicture = profilePicture;
    }

    await owner.save();

    const userData = transformDocument(owner);
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

    const owner = await Owner.findById(req.userId || req.user._id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }


    // Use relative path so nginx can proxy it correctly (owner uses owner-profile path)
    const profilePicture = `/uploads/owner-profile/${req.file.filename}`;
    
    // Delete old profile picture if it exists
    if (owner.profilePicture) {
      const fs = require('fs');
      const path = require('path');
      let oldFilePath;
      
      // Handle both full URL and relative path formats
      if (owner.profilePicture.startsWith('http')) {
        const urlParts = owner.profilePicture.split('/uploads/');
        if (urlParts.length > 1) {
          const relativePath = urlParts[1];
          oldFilePath = path.join(__dirname, '../uploads', relativePath);
        }
      } else if (owner.profilePicture.startsWith('/uploads/')) {
        oldFilePath = path.join(__dirname, '../..', owner.profilePicture.substring(1));
      } else if (owner.profilePicture.startsWith('uploads/')) {
        oldFilePath = path.join(__dirname, '../..', owner.profilePicture);
      }
      
      if (oldFilePath && fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (deleteError) {
          console.error('Error deleting old profile picture:', deleteError);
        }
      }
    }
    
    owner.profilePicture = profilePicture;
    await owner.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture,
      url: profilePicture
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
    const ownerId = req.userId || req.user._id.toString();

    // Get owner's properties
    const properties = await Property.find({ ownerId })
      .select('_id name price isActive');

    // Get total bookings for owner's properties
    const propertyIds = properties.map(property => property._id);
    
    let totalBookings = 0;
    let pendingBookings = 0;
    let acceptedBookings = 0;
    let cancelledBookings = 0;
    let totalRevenue = 0;

    if (propertyIds.length > 0) {
      const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
        .select('status totalPrice');

      totalBookings = bookings.length;
      pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
      acceptedBookings = bookings.filter(b => b.status === 'ACCEPTED').length;
      cancelledBookings = bookings.filter(b => b.status === 'CANCELLED' || b.status === 'REJECTED').length;
      totalRevenue = bookings
        .filter(b => b.status === 'ACCEPTED')
        .reduce((sum, b) => sum + parseFloat(b.totalPrice || 0), 0);
    }

    // Get recent bookings
    const recentBookings = await Booking.find({ propertyId: { $in: propertyIds } })
      .populate('propertyId', 'name')
      .populate('travelerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const transformedBookings = recentBookings.map(booking => {
      const transformed = transformDocument(booking);
      if (transformed.status === 'REJECTED') {
        transformed.status = 'CANCELLED';
      }
      return transformed;
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
        recentBookings: transformedBookings
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

