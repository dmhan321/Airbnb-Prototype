const express = require('express');
const path = require('path');
const fs = require('fs');

/**
 * Static file middleware that serves from service directory first,
 * then falls back to legacy uploads directory
 */
const serveUploads = (serviceUploadsDir, legacyUploadsDir) => {
  return (req, res, next) => {
    // Only handle /uploads requests
    if (!req.path.startsWith('/uploads/')) {
      return next();
    }

    const filePath = req.path.substring(1); // Remove leading '/'
    
    // Try service directory first
    const serviceFilePath = path.join(serviceUploadsDir, filePath.replace('uploads/', ''));
    if (fs.existsSync(serviceFilePath)) {
      return express.static(serviceUploadsDir)(req, res, next);
    }

    // Fallback to legacy directory
    const legacyFilePath = path.join(legacyUploadsDir, filePath.replace('uploads/', ''));
    if (fs.existsSync(legacyFilePath)) {
      return express.static(legacyUploadsDir)(req, res, next);
    }

    // File not found in either location
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  };
};

module.exports = { serveUploads };

