const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 
      `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME || 'airbnb_db'}`;
    
    await mongoose.connect(mongoURI, {
      // Remove deprecated options, use defaults
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Export models
const Traveler = require('./Traveler');
const Owner = require('./Owner');
const Property = require('./Property');
const Booking = require('./Booking');
const Favorite = require('./Favorite');
const PropertyView = require('./PropertyView');

module.exports = {
  connectDB,
  Traveler,
  Owner,
  Property,
  Booking,
  Favorite,
  PropertyView,
  mongoose
};



