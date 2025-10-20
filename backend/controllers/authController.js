const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Traveler, Owner } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profile-pictures';
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

    const existingTraveler = await Traveler.findOne({ where: { email } });
    if (existingTraveler) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const traveler = await Traveler.create({
      name,
      email,
      password: hashedPassword,
      phone,
      aboutMe,
      city,
      country,
      languages,
      gender
    });

    req.session.userId = traveler.id;
    req.session.userType = 'traveler';

    res.status(201).json({
      success: true,
      message: 'Traveler registered successfully',
      user: {
        id: traveler.id,
        name: traveler.name,
        email: traveler.email,
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

// Register Owner
const registerOwner = async (req, res) => {
  try {
    const { name, email, password, location, phone, aboutMe } = req.body;

    // Check if email already exists
    const existingOwner = await Owner.findOne({ where: { email } });
    if (existingOwner) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner
    const owner = await Owner.create({
      name,
      email,
      password: hashedPassword,
      location,
      phone,
      aboutMe
    });

    // Set session
    req.session.userId = owner.id;
    req.session.userType = 'owner';

    res.status(201).json({
      success: true,
      message: 'Owner registered successfully',
      user: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        userType: 'owner'
      }
    });
  } catch (error) {
    console.error('Owner registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    let user;
    if (userType === 'traveler') {
      user = await Traveler.findOne({ where: { email } });
    } else if (userType === 'owner') {
      user = await Owner.findOne({ where: { email } });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

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

    // Set session
    req.session.userId = user.id;
    req.session.userType = userType;


    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType
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

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({
      success: true,
      message: 'Logout successful'
    });
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

    // Remove password from response
    const userData = { ...req.user.toJSON() };
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

    const { name, email, phone, aboutMe, address, city, state, country, languages, gender } = req.body;
    const userId = req.user.id;
    const userType = req.session.userType;
    

    let user;
    if (userType === 'traveler') {
      user = await Traveler.findByPk(userId);
    } else if (userType === 'owner') {
      user = await Owner.findByPk(userId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = userType === 'traveler' 
        ? await Traveler.findOne({ where: { email } })
        : await Owner.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update user data
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      aboutMe: aboutMe || user.aboutMe,
      address: address || user.address,
      city: city || user.city,
      state: state || user.state,
      country: country || user.country,
      languages: languages || user.languages,
      gender: gender || user.gender
    };
    
    await user.update(updateData);

    // Remove password from response
    const userData = { ...user.toJSON() };
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

    const userId = req.user.id;
    const userType = req.session.userType;
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const profilePictureUrl = `${baseUrl}/uploads/profile-pictures/${req.file.filename}`;

    let user;
    if (userType === 'traveler') {
      user = await Traveler.findByPk(userId);
    } else if (userType === 'owner') {
      user = await Owner.findByPk(userId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

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
          oldFilePath = 'uploads/' + urlParts[1];
        }
      } else if (user.profilePicture.startsWith('/uploads/')) {
        // Relative path format: remove leading slash
        oldFilePath = user.profilePicture.substring(1);
      } else if (user.profilePicture.startsWith('uploads/')) {
        // Already relative path
        oldFilePath = user.profilePicture;
      }
      
      // Delete the file if it exists
      if (oldFilePath && fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update user with new profile picture URL
    await user.update({ profilePicture: profilePictureUrl });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      url: profilePictureUrl
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
  registerOwner,
  login,
  logout,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  upload
};
