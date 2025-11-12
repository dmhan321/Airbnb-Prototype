const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// MongoDB connection and models
const { connectDB } = require('../shared/models/mongoose');

const app = express();
const PORT = process.env.PORT || 5003;

// Connect to MongoDB
connectDB();

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
// Serve from service-specific directory first, then fallback to old location
const serviceUploadsDir = path.join(__dirname, 'uploads');
const legacyUploadsDir = path.join(__dirname, '../../uploads');

// Custom middleware to check both directories (similar to profile picture fix)
app.use('/uploads', (req, res, next) => {
  const filePath = req.path.replace('/uploads/', '');
  
  // Try service directory first
  const serviceFile = path.join(serviceUploadsDir, filePath);
  if (fs.existsSync(serviceFile)) {
    return res.sendFile(serviceFile, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        next(err);
      }
    });
  }
  
  const legacyFile = path.join(legacyUploadsDir, filePath);
  if (fs.existsSync(legacyFile)) {
    return res.sendFile(legacyFile, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        next(err);
      }
    });
  }
  
  console.error('File not found:', {
    requestedPath: req.path,
    filePath,
    serviceFile,
    legacyFile,
    serviceExists: fs.existsSync(serviceFile),
    legacyExists: fs.existsSync(legacyFile),
    serviceUploadsDir,
    legacyUploadsDir
  });
  
  res.status(404).json({ error: 'File not found' });
});

// Routes
app.use('/api/properties', require('./routes/properties'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'property-service' });
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
  console.log(`Property Service running on port ${PORT}`);
});

