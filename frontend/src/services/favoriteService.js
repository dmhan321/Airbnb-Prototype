import { travelerApi } from './api';

export const favoriteService = {
  // Add to favorites
  addFavorite: async (propertyId) => {
    const response = await travelerApi.post('/favorites', { propertyId });
    return response.data;
  },

  // Get favorites
  getFavorites: async () => {
    const response = await travelerApi.get('/favorites');
    return response.data;
  },

  // Remove from favorites
  removeFavorite: async (id) => {
    const response = await travelerApi.delete(`/favorites/${id}`);
    return response.data;
  },

  // Check if property is favorited
  checkFavorite: async (propertyId) => {
    const response = await travelerApi.get(`/favorites/check/${propertyId}`);
    return response.data;
  }
};
