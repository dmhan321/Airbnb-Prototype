import api from './api';

export const authService = {
  // Register traveler
  registerTraveler: async (userData) => {
    const response = await api.post('/auth/register/traveler', userData);
    return response.data;
  },

  // Register owner
  registerOwner: async (userData) => {
    const response = await api.post('/auth/register/owner', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file, userType = 'traveler') => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const endpoint = userType === 'owner' ? '/owners/profile/picture' : '/travelers/profile/picture';
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
