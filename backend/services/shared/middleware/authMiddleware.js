const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Traveler, Owner } = require('../models/mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'airbnb-secret-key-change-in-production';

// Check if user is authenticated (JWT)
const requireAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Check if user is a traveler
// Note: This assumes requireAuth has already been called (which it is, globally in routes)
const requireTraveler = async (req, res, next) => {
  // requireAuth is already applied globally, so req.userType should be set
  if (!req.userType) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.userType !== 'traveler') {
    return res.status(403).json({
      success: false,
      message: 'Traveler access required'
    });
  }
  
  next();
};

// Check if user is an owner
// Note: This assumes requireAuth has already been called (which it is, globally in routes)
const requireOwner = async (req, res, next) => {
  // requireAuth is already applied globally, so req.userType should be set
  if (!req.userType) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.userType !== 'owner') {
    return res.status(403).json({
      success: false,
      message: 'Owner access required'
    });
  }
  
  next();
};

// Get current user from JWT token
const getCurrentUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Fetch user from database
        let user;
        
        // Convert userId to ObjectId if it's a string
        const userId = mongoose.Types.ObjectId.isValid(decoded.userId)
          ? new mongoose.Types.ObjectId(decoded.userId)
          : decoded.userId;
        
        if (decoded.userType === 'traveler') {
          user = await Traveler.findById(userId);
        } else if (decoded.userType === 'owner') {
          user = await Owner.findById(userId);
        }
        
        if (user) {
          req.user = user;
          req.userType = decoded.userType;
          req.userId = decoded.userId;
        }
      } catch (tokenError) {
        // Token invalid or expired, but continue without user
        // This allows optional authentication
      }
    }
    
    next();
  } catch (error) {
    console.error('Error getting current user:', error);
    next();
  }
};

module.exports = {
  requireAuth,
  requireTraveler,
  requireOwner,
  getCurrentUser
};
