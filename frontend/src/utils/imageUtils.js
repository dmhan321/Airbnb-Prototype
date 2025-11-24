// Utility functions for handling image URLs
// Updated for microservices architecture

// Service URLs - can be configured via environment variables
// Note: Build args may include /api, but we need base URLs for images
const getBaseServiceUrl = (url) => {
  if (!url) return '';
  // Remove /api suffix if present (images are served at /uploads/, not /api/uploads/)
  return url.replace(/\/api\/?$/, '');
};

// In production (AWS), use relative URLs that go through nginx proxy
// In development, these can be set to localhost URLs
const SERVICES = {
  traveler: getBaseServiceUrl(process.env.REACT_APP_TRAVELER_SERVICE_URL) || '',
  owner: getBaseServiceUrl(process.env.REACT_APP_OWNER_SERVICE_URL) || '',
  property: getBaseServiceUrl(process.env.REACT_APP_PROPERTY_SERVICE_URL) || '',
  booking: getBaseServiceUrl(process.env.REACT_APP_BOOKING_SERVICE_URL) || ''
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
  
  // FIRST: Convert full URLs (http:// or https://) to relative paths
  // This must be checked first before other pattern matching
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Extract the path part from full URLs (e.g., http://domain.com/uploads/... -> /uploads/...)
    const urlMatch = imagePath.match(/https?:\/\/[^\/]+(\/.*)/);
    if (urlMatch) {
      return urlMatch[1]; // Return just the path part (e.g., /uploads/property-photos/...)
    }
    // If no path found, return as-is (shouldn't happen)
    return imagePath;
  }
  
  // Convert Kubernetes service names to relative paths
  if (imagePath.includes('property-service:5003')) {
    // Extract the path part and make it relative
    const pathMatch = imagePath.match(/property-service:5003(\/.*)/);
    if (pathMatch) {
      return pathMatch[1]; // Return the path part (e.g., /uploads/property-photos/...)
    }
    return imagePath.replace(/.*property-service:5003/, '');
  }
  if (imagePath.includes('traveler-service:5001')) {
    const pathMatch = imagePath.match(/traveler-service:5001(\/.*)/);
    if (pathMatch) {
      return pathMatch[1];
    }
    return imagePath.replace(/.*traveler-service:5001/, '');
  }
  if (imagePath.includes('owner-service:5002')) {
    const pathMatch = imagePath.match(/owner-service:5002(\/.*)/);
    if (pathMatch) {
      return pathMatch[1];
    }
    return imagePath.replace(/.*owner-service:5002/, '');
  }
  
  // Convert full URLs with localhost to relative paths
  if (imagePath.includes('localhost:5003') && imagePath.includes('/uploads/')) {
    const pathMatch = imagePath.match(/localhost:5003(\/.*)/);
    if (pathMatch) {
      return pathMatch[1];
    }
  }
  if (imagePath.includes('localhost:5001') && imagePath.includes('/uploads/')) {
    const pathMatch = imagePath.match(/localhost:5001(\/.*)/);
    if (pathMatch) {
      return pathMatch[1];
    }
  }
  if (imagePath.includes('localhost:5002') && imagePath.includes('/uploads/')) {
    const pathMatch = imagePath.match(/localhost:5002(\/.*)/);
    if (pathMatch) {
      return pathMatch[1];
    }
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
  
  // Handle bare filenames (property-*.png, property-*.jpg)
  if (imagePath.match(/^property-\d+-\d+\.(png|jpg|jpeg|gif|webp)$/i)) {
    return `/uploads/property-photos/${imagePath}`;
  }
  if (imagePath.match(/^property-.*\.(png|jpg|jpeg|gif|webp)$/i) && !imagePath.includes('/')) {
    return `/uploads/property-photos/${imagePath}`;
  }
  
  // For relative paths, use relative URLs (nginx will proxy them)
  // If it starts with '/', use it as-is (already a relative path)
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Determine service based on path content
  if (imagePath.includes('owner-profile')) {
    // Owner profile pictures use owner-profile path
    if (imagePath.startsWith('/')) {
      return imagePath; // Already has full path
    }
    return `/uploads/owner-profile/${imagePath}`;
  } else if (imagePath.includes('profile-pictures') || imagePath.includes('profile')) {
    // Traveler profile pictures use profile-pictures path
    if (imagePath.startsWith('/')) {
      return imagePath; // Already has full path
    }
    return `/uploads/profile-pictures/${imagePath}`;
  } else if (imagePath.includes('property-photos') || imagePath.includes('property')) {
    return `/uploads/property-photos/${imagePath}`;
  }
  
  // Default to property photos
  return `/uploads/property-photos/${imagePath}`;
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
