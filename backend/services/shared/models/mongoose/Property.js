const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  amenities: {
    type: String,
    trim: true
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1
  },
  availableFrom: {
    type: Date
  },
  availableTo: {
    type: Date
  },
  images: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
propertySchema.index({ ownerId: 1 });
propertySchema.index({ city: 1, country: 1 });
propertySchema.index({ isActive: 1 });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;



