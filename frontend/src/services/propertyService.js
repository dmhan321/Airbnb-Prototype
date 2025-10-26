import api from './api';

export const propertyService = {
  // Get all properties
  getAllProperties: async () => {
    const response = await api.get('/properties');
    return response.data;
  },

  // Search properties
  searchProperties: async (filters) => {
    const response = await api.get('/properties/search', { params: filters });
    return response.data;
  },

  // Get property by ID
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create property (owner only)
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  // Get owner properties
  getOwnerProperties: async () => {
    const response = await api.get('/properties/owner/properties');
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Upload property photos
  uploadPropertyPhotos: async (propertyId, photos, replace = false) => {
    const formData = new FormData();
    photos.forEach(photo => {
      formData.append('photos', photo);
    });
    
    const url = replace 
      ? `/properties/${propertyId}/photos?replace=true`
      : `/properties/${propertyId}/photos`;
    
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
