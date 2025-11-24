const { Traveler } = require('../../shared/models/mongoose');
const { transformDocument } = require('../../shared/utils/transform');

// Get traveler profile
const getProfile = async (req, res) => {
  try {
    const traveler = await Traveler.findById(req.userId || req.user._id);
    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: 'Traveler not found'
      });
    }

    const userData = transformDocument(traveler);
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
    const { name, email, phone, aboutMe, city, state, country, languages, gender } = req.body;
    
    const traveler = await Traveler.findById(req.userId || req.user._id);
    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: 'Traveler not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== traveler.email) {
      const existingTraveler = await Traveler.findOne({ email: email.toLowerCase() });
      if (existingTraveler) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    if (name) traveler.name = name;
    if (email) traveler.email = email.toLowerCase();
    if (phone !== undefined) traveler.phone = phone;
    if (aboutMe !== undefined) traveler.aboutMe = aboutMe;
    if (city !== undefined) traveler.city = city;
    if (state !== undefined) traveler.state = state;
    if (country !== undefined) traveler.country = country;
    if (languages !== undefined) traveler.languages = languages;
    if (gender !== undefined) traveler.gender = gender;

    await traveler.save();

    const userData = transformDocument(traveler);
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

    const traveler = await Traveler.findById(req.userId || req.user._id);
    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: 'Traveler not found'
      });
    }


    // Use relative path so nginx can proxy it correctly
    const profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    
    // Delete old profile picture if it exists
    if (traveler.profilePicture) {
      const fs = require('fs');
      const path = require('path');
      let oldFilePath;
      
      // Handle both full URL and relative path formats
      if (traveler.profilePicture.startsWith('http')) {
        const urlParts = traveler.profilePicture.split('/uploads/');
        if (urlParts.length > 1) {
          const relativePath = urlParts[1];
          oldFilePath = path.join(__dirname, '../uploads', relativePath);
        }
      } else if (traveler.profilePicture.startsWith('/uploads/')) {
        oldFilePath = path.join(__dirname, '../..', traveler.profilePicture.substring(1));
      } else if (traveler.profilePicture.startsWith('uploads/')) {
        oldFilePath = path.join(__dirname, '../..', traveler.profilePicture);
      }
      
      if (oldFilePath && fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (deleteError) {
          console.error('Error deleting old profile picture:', deleteError);
        }
      }
    }
    
    traveler.profilePicture = profilePicture;
    await traveler.save();

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

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture
};

