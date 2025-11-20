const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Traveler } = require('../../shared/models/mongoose');
const { transformDocument } = require('../../shared/utils/transform');

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'airbnb-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper function to generate JWT token
const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Configure multer for file uploads
// Use persistent volume mount path if available, otherwise fallback to relative path
const UPLOADS_BASE_DIR = process.env.UPLOADS_DIR || '/app/uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(UPLOADS_BASE_DIR, 'profile-pictures');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const registerTraveler = async (req, res) => {
  try {
    const { name, email, password, phone, aboutMe, city, country, languages, gender } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const existingTraveler = await Traveler.findOne({ email: email.toLowerCase() });
    if (existingTraveler) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create traveler - only include fields that are provided
    const travelerData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    };
    
    // Add optional fields only if provided
    if (phone) travelerData.phone = phone;
    if (aboutMe) travelerData.aboutMe = aboutMe;
    if (city) travelerData.city = city;
    if (country) travelerData.country = country;
    if (languages) travelerData.languages = languages;
    if (gender) travelerData.gender = gender;

    const traveler = new Traveler(travelerData);
    await traveler.save();

    // Generate JWT token
    const token = generateToken(traveler._id.toString(), 'traveler');

    const userData = transformDocument(traveler);
    delete userData.password;

    res.status(201).json({
      success: true,
      message: 'Traveler registered successfully',
      token,
      user: {
        ...userData,
        userType: 'traveler'
      }
    });
  } catch (error) {
    console.error('Traveler registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Login (handles both traveler and owner, but this service only handles traveler)
const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Only handle traveler login in this service
    if (userType !== 'traveler') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type for this service'
      });
    }

    const user = await Traveler.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), 'traveler');

    const userData = transformDocument(user);
    delete userData.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        ...userData,
        userType: 'traveler'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Logout (JWT is stateless, so logout is handled client-side by removing token)
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Fetch fresh user data from database to ensure we have the latest profile picture
    const userId = req.user._id || req.userId;
    const mongoose = require('mongoose');
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;
    
    const freshUser = await Traveler.findById(userObjectId);
    
    if (!freshUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const userData = transformDocument(freshUser);
    delete userData.password;


    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const { name, email, phone, aboutMe, address, city, state, country, languages, gender, profilePicture } = req.body;
    
    let user = req.user;
    
    if (!user && req.userId) {
      const mongoose = require('mongoose');
      const userObjectId = mongoose.Types.ObjectId.isValid(req.userId)
        ? new mongoose.Types.ObjectId(req.userId)
        : req.userId;
      user = await Traveler.findById(userObjectId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== user.email) {
      // Require password verification when changing email (security measure)
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required to change email address'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect password. Password is required to change email address'
        });
      }

      const existingUser = await Traveler.findOne({ email: email.toLowerCase() });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update user data
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone !== undefined) user.phone = phone;
    if (aboutMe !== undefined) user.aboutMe = aboutMe;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (country !== undefined) user.country = country;
    if (languages !== undefined) user.languages = languages;
    if (gender !== undefined) user.gender = gender;
    
    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }
    
    await user.save();

    const userData = transformDocument(user);
    delete userData.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Fetch fresh user data from database
    // Use req.userId from requireAuth middleware if req.user is not set
    let userId = req.user?._id || req.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found'
      });
    }
    
    const mongoose = require('mongoose');
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;
    
    const user = await Traveler.findById(userObjectId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// Upload Profile Picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user._id;
    const baseUrl = process.env.PUBLIC_TRAVELER_SERVICE_URL || process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`;
    const profilePictureUrl = `${baseUrl}/uploads/profile-pictures/${req.file.filename}`;

    const user = await Traveler.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile picture if it exists
    if (user.profilePicture) {
      let oldFilePath;
      
      // Handle both full URL and relative path formats
      if (user.profilePicture.startsWith('http')) {
        // Full URL format: extract the relative path
        const urlParts = user.profilePicture.split('/uploads/');
        if (urlParts.length > 1) {
          // Extract filename from path like "profile-pictures/filename.jpg"
          const relativePath = urlParts[1];
          // Use the same directory structure as uploads
          oldFilePath = path.join(__dirname, '../uploads', relativePath);
        }
      } else if (user.profilePicture.startsWith('/uploads/')) {
        // Relative path format: remove leading slash
        oldFilePath = path.join(__dirname, '../..', user.profilePicture.substring(1));
      } else if (user.profilePicture.startsWith('uploads/')) {
        // Already relative path
        oldFilePath = path.join(__dirname, '../..', user.profilePicture);
      }
      
      if (oldFilePath && fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (deleteError) {
          console.error('Error deleting old profile picture:', deleteError);
        }
      }
    }

    // Update user with new profile picture URL
    user.profilePicture = profilePictureUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      url: profilePictureUrl,
      profilePicture: profilePictureUrl
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
  registerTraveler,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  upload
};

