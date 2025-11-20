const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// MongoDB connection and models
const { connectDB } = require('../shared/models/mongoose');

// Kafka initialization
const { connectProducer } = require('../shared/kafka/kafkaClient');
const { startStatusConsumer } = require('./kafka/statusConsumer');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Initialize Kafka
connectProducer()
  .then(() => startStatusConsumer())
  .then(() => console.log('✓ Kafka integration ready'))
  .catch(err => console.error('✗ Kafka initialization error:', err.message));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
// Use persistent volume mount path if available, otherwise fallback to relative paths
const UPLOADS_BASE_DIR = process.env.UPLOADS_DIR || '/app/uploads';
const serviceUploadsDir = path.join(__dirname, 'uploads');
const legacyUploadsDir = path.join(__dirname, '../../uploads');

// Custom middleware to check all possible directories
app.use('/uploads', (req, res, next) => {
  const filePath = req.path.replace('/uploads/', '');
  
  // Try persistent volume mount first (for Kubernetes)
  const persistentFile = path.join(UPLOADS_BASE_DIR, filePath);
  if (fs.existsSync(persistentFile)) {
    return res.sendFile(persistentFile, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        next(err);
      }
    });
  }
  
  // Try service directory
  const serviceFile = path.join(serviceUploadsDir, filePath);
  if (fs.existsSync(serviceFile)) {
    return res.sendFile(serviceFile, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        next(err);
      }
    });
  }
  
  // Try legacy directory
  const legacyFile = path.join(legacyUploadsDir, filePath);
  if (fs.existsSync(legacyFile)) {
    return res.sendFile(legacyFile, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        next(err);
      }
    });
  }
  
  console.error(`File not found: ${req.path}`);
  res.status(404).json({ error: 'File not found' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/travelers', require('./routes/travelers'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'traveler-service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`Traveler Service running on port ${PORT}`);
});

