const axios = require('axios');

/**
 * Service-to-service HTTP client
 * Provides a simple way to make HTTP calls between microservices
 */
class ServiceClient {
  constructor(baseURL, timeout = 5000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Make a GET request
   */
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make a POST request
   */
  async post(url, data, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make a PUT request
   */
  async put(url, data, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors from service calls
   */
  handleError(error) {
    if (error.response) {
      // Service responded with error status
      return {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        data: error.response.data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 503,
        message: 'Service unavailable',
        data: null
      };
    } else {
      // Error setting up request
      return {
        status: 500,
        message: error.message,
        data: null
      };
    }
  }
}

// Create service clients for each service
const createServiceClient = (serviceName) => {
  const serviceUrls = {
    traveler: process.env.TRAVELER_SERVICE_URL || 'http://localhost:5001',
    owner: process.env.OWNER_SERVICE_URL || 'http://localhost:5002',
    property: process.env.PROPERTY_SERVICE_URL || 'http://localhost:5003',
    booking: process.env.BOOKING_SERVICE_URL || 'http://localhost:5004'
  };

  const baseURL = serviceUrls[serviceName];
  if (!baseURL) {
    throw new Error(`Unknown service: ${serviceName}`);
  }

  return new ServiceClient(baseURL);
};

module.exports = {
  ServiceClient,
  createServiceClient
};

