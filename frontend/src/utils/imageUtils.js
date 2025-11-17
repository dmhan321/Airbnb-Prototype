// Utility functions for handling image URLs
// Updated for microservices architecture

// Service URLs - can be configured via environment variables
// Note: Build args may include /api, but we need base URLs for images
const getBaseServiceUrl = (url) => {
  if (!url) return '';
  // Remove /api suffix if present (images are served at /uploads/, not /api/uploads/)
  return url.replace(/\/api\/?$/, '');
};

const SERVICES = {
  traveler: getBaseServiceUrl(process.env.REACT_APP_TRAVELER_SERVICE_URL) || 'http://localhost:5001',
  owner: getBaseServiceUrl(process.env.REACT_APP_OWNER_SERVICE_URL) || 'http://localhost:5002',
  property: getBaseServiceUrl(process.env.REACT_APP_PROPERTY_SERVICE_URL) || 'http://localhost:5003',
  booking: getBaseServiceUrl(process.env.REACT_APP_BOOKING_SERVICE_URL) || 'http://localhost:5004'
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
  
  // Convert Kubernetes service names to localhost (for port-forward access)
  if (imagePath.includes('property-service:5003')) {
    const fixed = imagePath.replace(/property-service:5003/g, 'http://localhost:5003');
    if (!fixed.startsWith('http://') && !fixed.startsWith('https://')) {
      return 'http://' + fixed;
    }
    return fixed;
  }
  if (imagePath.includes('traveler-service:5001')) {
    if (imagePath.startsWith('traveler-service:5001')) {
      return 'http://localhost:5001' + imagePath.substring('traveler-service:5001'.length);
    }
    return imagePath.replace(/traveler-service:5001/g, 'localhost:5001').replace(/^([^h])/, 'http://$1');
  }
  if (imagePath.includes('owner-service:5002')) {
    if (imagePath.startsWith('owner-service:5002')) {
      return 'http://localhost:5002' + imagePath.substring('owner-service:5002'.length);
    }
    return imagePath.replace(/owner-service:5002/g, 'localhost:5002').replace(/^([^h])/, 'http://$1');
  }
  
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
  
  // Fix full URLs with Kubernetes service names or wrong ports
  if (imagePath.startsWith('http')) {
    if (imagePath.includes('property-service:5003')) {
      return imagePath.replace(/http:\/\/property-service:5003/g, 'http://localhost:5003');
    }
    if (imagePath.includes('traveler-service:5001')) {
      return imagePath.replace(/http:\/\/traveler-service:5001/g, 'http://localhost:5001');
    }
    if (imagePath.includes('owner-service:5002')) {
      return imagePath.replace(/http:\/\/owner-service:5002/g, 'http://localhost:5002');
    }
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
  
  // Handle bare filenames (property-*.png, property-*.jpg)
  if (imagePath.match(/^property-\d+-\d+\.(png|jpg|jpeg|gif|webp)$/i)) {
    return `${SERVICES.property}/uploads/property-photos/${imagePath}`;
  }
  if (imagePath.match(/^property-.*\.(png|jpg|jpeg|gif|webp)$/i) && !imagePath.includes('/')) {
    return `${SERVICES.property}/uploads/property-photos/${imagePath}`;
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
 * Gets the backend URL for a specific service (base URL, no /api)
 * @param {string} serviceName - Service name ('traveler', 'owner', 'property', 'booking')
 * @returns {string} - Service base URL
 */
export const getServiceUrl = (serviceName) => {
  return SERVICES[serviceName] || LEGACY_BACKEND_URL;
};

/**
 * Gets the API URL for a specific service (with /api suffix)
 * @param {string} serviceName - Service name ('traveler', 'owner', 'property', 'booking')
 * @returns {string} - Service API URL
 */
export const getApiUrl = (serviceName) => {
  const baseUrl = SERVICES[serviceName] || LEGACY_BACKEND_URL;
  // Ensure /api is added (base URLs don't have /api)
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

/**
 * Gets the backend URL for static files (legacy support)
 * @returns {string} - Backend URL
 */
export const getBackendUrl = () => LEGACY_BACKEND_URL;
