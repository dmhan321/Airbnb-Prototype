import api from './api';

export const bookingService = {
  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get traveler bookings
  getTravelerBookings: async () => {
    const response = await api.get('/bookings/traveler');
    return response.data;
  },

  // Get owner bookings
  getOwnerBookings: async () => {
    const response = await api.get('/bookings/owner');
    return response.data;
  },

  // Accept booking
  acceptBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/accept`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  }
};


