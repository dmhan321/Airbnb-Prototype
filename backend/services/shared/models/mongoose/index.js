const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 
      `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME || 'airbnb_db'}`;
    
    await mongoose.connect(mongoURI, {
      // Connection pool settings for high concurrent loads
      maxPoolSize: 50,              // Maximum number of connections in the pool (default: 10)
      minPoolSize: 10,               // Minimum number of connections to maintain
      maxIdleTimeMS: 30000,          // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // How long to wait for server selection
      socketTimeoutMS: 45000,        // How long to wait for socket operations
      connectTimeoutMS: 10000,        // How long to wait for initial connection
      // Buffer settings (bufferMaxEntries removed - deprecated in MongoDB driver v4+)
      bufferCommands: false,        // Disable mongoose buffering
    });
    
    // Set global connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    console.log('MongoDB connected successfully');
    console.log(`Connection pool: min=${10}, max=${50}`);
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



