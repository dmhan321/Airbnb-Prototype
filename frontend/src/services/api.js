import axios from 'axios';

// Service URLs - can be configured via environment variables
const SERVICES = {
  traveler: process.env.REACT_APP_TRAVELER_SERVICE_URL || 'http://localhost:5001/api',
  owner: process.env.REACT_APP_OWNER_SERVICE_URL || 'http://localhost:5002/api',
  property: process.env.REACT_APP_PROPERTY_SERVICE_URL || 'http://localhost:5003/api',
  booking: process.env.REACT_APP_BOOKING_SERVICE_URL || 'http://localhost:5004/api'
};

// Create axios instances for each service
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    withCredentials: false
  });

  // Add JWT token to requests if available
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle responses
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Don't automatically redirect on 401 errors
      // Components will handle authentication errors as needed
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create API instances for each service
const travelerApi = createApiInstance(SERVICES.traveler);
const ownerApi = createApiInstance(SERVICES.owner);
const propertyApi = createApiInstance(SERVICES.property);
const bookingApi = createApiInstance(SERVICES.booking);

// Default export - use traveler service for backward compatibility
const api = travelerApi;

// Export service-specific APIs
export { travelerApi, ownerApi, propertyApi, bookingApi };

export default api;
