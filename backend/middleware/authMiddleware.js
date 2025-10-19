const { Traveler, Owner } = require('../models');

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userType) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Authentication required'
  });
};

// Check if user is a traveler
const requireTraveler = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userType === 'traveler') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Traveler access required'
  });
};

// Check if user is an owner
const requireOwner = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userType === 'owner') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Owner access required'
  });
};

// Get current user from session
const getCurrentUser = async (req, res, next) => {
  try {
    if (req.session && req.session.userId && req.session.userType) {
      let user;
      if (req.session.userType === 'traveler') {
        user = await Traveler.findByPk(req.session.userId);
      } else if (req.session.userType === 'owner') {
        user = await Owner.findByPk(req.session.userId);
      }
      
      if (user) {
        req.user = user;
        req.userType = req.session.userType;
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
