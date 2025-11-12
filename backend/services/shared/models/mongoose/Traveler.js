const mongoose = require('mongoose');

const travelerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  aboutMe: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  languages: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Note: email index is automatically created by unique: true
// No need to explicitly create it again

const Traveler = mongoose.model('Traveler', travelerSchema);

module.exports = Traveler;

