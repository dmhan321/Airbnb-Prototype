import api from './api';

export const favoriteService = {
  // Add to favorites
  addFavorite: async (propertyId) => {
    const response = await api.post('/favorites', { propertyId });
    return response.data;
  },

  // Get favorites
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  // Remove from favorites
  removeFavorite: async (id) => {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
  },

  // Check if property is favorited
  checkFavorite: async (propertyId) => {
    const response = await api.get(`/favorites/check/${propertyId}`);
    return response.data;
  }
};


