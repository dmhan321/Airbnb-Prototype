// Utility functions for handling image URLs
// Updated for microservices architecture

// Service URLs - can be configured via environment variables
const SERVICES = {
  traveler: process.env.REACT_APP_TRAVELER_SERVICE_URL || 'http://localhost:5001',
  owner: process.env.REACT_APP_OWNER_SERVICE_URL || 'http://localhost:5002',
  property: process.env.REACT_APP_PROPERTY_SERVICE_URL || 'http://localhost:5003',
  booking: process.env.REACT_APP_BOOKING_SERVICE_URL || 'http://localhost:5004'
};

// Legacy backend URL (for old photos)
const LEGACY_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

/**
 * Prepends the appropriate service URL to image paths
 * Handles migration from old port 5000 to new microservice ports
 * @param {string} imagePath - The image path from the API
 * @returns {string} - Full URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Handle malformed URLs that start with :5000 (missing protocol/host)
  if (imagePath.startsWith(':5000')) {
    const pathPart = imagePath.substring(5); // Remove ':5000'
    // Determine service based on path
    if (pathPart.includes('/uploads/profile-pictures')) {
      return `${SERVICES.traveler}${pathPart}`;
    } else if (pathPart.includes('/uploads/property-photos')) {
      return `${SERVICES.property}${pathPart}`;
    }
    // Default to property service
    return `${SERVICES.property}${pathPart}`;
  }
  
  // Handle URLs that contain :5000 anywhere (old server) - fix malformed URLs
  if (imagePath.includes(':5000')) {
    // Determine which service based on path
    if (imagePath.includes('/uploads/profile-pictures')) {
      // Replace :5000 with correct service URL
      if (imagePath.startsWith('http')) {
        return imagePath.replace(/:5000/g, ':5001');
      } else {
        // Malformed URL starting with :5000
        const pathPart = imagePath.replace(/:5000/g, '');
        return `${SERVICES.traveler}${pathPart}`;
      }
    } else if (imagePath.includes('/uploads/property-photos')) {
      if (imagePath.startsWith('http')) {
        return imagePath.replace(/:5000/g, ':5003');
      } else {
        // Malformed URL starting with :5000
        const pathPart = imagePath.replace(/:5000/g, '');
        return `${SERVICES.property}${pathPart}`;
      }
    }
    // Default to property service
    if (imagePath.startsWith('http')) {
      return imagePath.replace(/:5000/g, ':5003');
    } else {
      const pathPart = imagePath.replace(/:5000/g, '');
      return `${SERVICES.property}${pathPart}`;
    }
  }
  
  // If it's already a full URL, check and fix wrong ports
  if (imagePath.startsWith('http')) {
    // Fix wrong port for property photos
    if (imagePath.includes(':5000') && imagePath.includes('/uploads/property-photos')) {
      return imagePath.replace(/localhost:5000/g, 'localhost:5003').replace(/:5000/g, ':5003');
    }
    // Fix wrong port for profile pictures
    if (imagePath.includes(':5000') && imagePath.includes('/uploads/profile-pictures')) {
      return imagePath.replace(/localhost:5000/g, 'localhost:5001').replace(/:5000/g, ':5001');
    }
    // Fix any other :5000 references (default to property service)
    if (imagePath.includes(':5000')) {
      return imagePath.replace(/localhost:5000/g, 'localhost:5003').replace(/:5000/g, ':5003');
    }
    return imagePath;
  }
  
  // For relative paths, determine the service
  let serviceUrl = SERVICES.property; // Default to property service
  
  if (imagePath.includes('profile-pictures') || imagePath.includes('profile')) {
    serviceUrl = SERVICES.traveler;
  } else if (imagePath.includes('property-photos') || imagePath.includes('property')) {
    serviceUrl = SERVICES.property;
  }
  
  // If it starts with '/', prepend service URL
  if (imagePath.startsWith('/')) {
    return `${serviceUrl}${imagePath}`;
  }
  
  // Otherwise, assume it's a relative path and prepend service URL with '/'
  return `${serviceUrl}/${imagePath}`;
};

/**
 * Gets the backend URL for a specific service
 * @param {string} serviceName - Service name ('traveler', 'owner', 'property', 'booking')
 * @returns {string} - Service URL
 */
export const getServiceUrl = (serviceName) => {
  return SERVICES[serviceName] || LEGACY_BACKEND_URL;
};

/**
 * Gets the backend URL for static files (legacy support)
 * @returns {string} - Backend URL
 */
export const getBackendUrl = () => LEGACY_BACKEND_URL;
