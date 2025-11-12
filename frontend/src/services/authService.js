import { travelerApi, ownerApi } from './api';

export const authService = {
  // Register traveler
  registerTraveler: async (userData) => {
    const response = await travelerApi.post('/auth/register/traveler', userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register owner
  registerOwner: async (userData) => {
    const response = await ownerApi.post('/auth/register/owner', userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login - routes to correct service based on userType
  login: async (credentials) => {
    const api = credentials.userType === 'owner' ? ownerApi : travelerApi;
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout - try both services (doesn't matter which one)
  logout: async () => {
    try {
      await travelerApi.post('/auth/logout');
    } catch (error) {
      // Ignore errors
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return { success: true };
  },

  // Get profile - routes to correct service based on userType
  getProfile: async (userType = 'traveler') => {
    const api = userType === 'owner' ? ownerApi : travelerApi;
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile - routes to correct service based on userType
  updateProfile: async (profileData, userType = 'traveler') => {
    const api = userType === 'owner' ? ownerApi : travelerApi;
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password - routes to correct service based on userType
  changePassword: async (currentPassword, newPassword, userType = 'traveler') => {
    const api = userType === 'owner' ? ownerApi : travelerApi;
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Upload profile picture - routes to correct service based on userType
  uploadProfilePicture: async (file, userType = 'traveler') => {
    const api = userType === 'owner' ? ownerApi : travelerApi;
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const endpoint = userType === 'owner' 
      ? '/owners/profile/picture' 
      : '/travelers/profile/picture';
    
    const response = await api.post(endpoint, formData);
    return response.data;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get user from localStorage
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
