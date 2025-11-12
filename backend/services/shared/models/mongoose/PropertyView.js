const mongoose = require('mongoose');

const propertyViewSchema = new mongoose.Schema({
  travelerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Traveler',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
propertyViewSchema.index({ travelerId: 1, propertyId: 1 });
propertyViewSchema.index({ viewedAt: -1 });

const PropertyView = mongoose.model('PropertyView', propertyViewSchema);

module.exports = PropertyView;



