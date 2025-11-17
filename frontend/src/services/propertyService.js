import { propertyApi } from './api';

export const propertyService = {
  // Get all properties
  getAllProperties: async () => {
    const response = await propertyApi.get('/properties');
    return response.data;
  },

  // Search properties
  searchProperties: async (filters) => {
    const response = await propertyApi.get('/properties/search', { params: filters });
    return response.data;
  },

  // Get property by ID
  getPropertyById: async (id) => {
    const response = await propertyApi.get(`/properties/${id}`);
    return response.data;
  },

  // Create property (owner only)
  createProperty: async (propertyData) => {
    const response = await propertyApi.post('/properties', propertyData);
    return response.data;
  },

  // Get owner properties
  getOwnerProperties: async () => {
    const response = await propertyApi.get('/properties/owner/my-properties');
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await propertyApi.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await propertyApi.delete(`/properties/${id}`);
    return response.data;
  },

  // Upload property photos
  uploadPropertyPhotos: async (propertyId, photos, isNewProperty = true) => {
    const formData = new FormData();
    
    // Append all photos to FormData
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });
    
    // propertyId is in the URL, not needed in formData
    
    const response = await propertyApi.post(`/properties/${propertyId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
