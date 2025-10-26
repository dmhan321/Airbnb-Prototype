// Utility functions for handling image URLs

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

/**
 * Prepends the backend URL to image paths returned from the API
 * @param {string} imagePath - The image path from the API (e.g., "/uploads/filename.jpg")
 * @returns {string} - Full URL to the image (e.g., "http://localhost:5000/uploads/filename.jpg")
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with '/', prepend backend URL
  if (imagePath.startsWith('/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // Otherwise, assume it's a relative path and prepend backend URL with '/'
  return `${BACKEND_URL}/${imagePath}`;
};

/**
 * Gets the backend URL for static files
 * @returns {string} - Backend URL
 */
export const getBackendUrl = () => BACKEND_URL;
