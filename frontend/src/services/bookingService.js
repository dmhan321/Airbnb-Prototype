import { bookingApi, ownerApi, travelerApi } from './api';

export const bookingService = {
  // Create booking (via Kafka - calls Traveler Service)
  createBooking: async (bookingData) => {
    // Route through Traveler Service which publishes to Kafka
    const response = await travelerApi.post('/bookings', bookingData);
    return response.data;
  },

  // Get traveler bookings
  getTravelerBookings: async () => {
    const response = await bookingApi.get('/bookings/traveler');
    return response.data;
  },

  // Get owner bookings
  getOwnerBookings: async () => {
    const response = await ownerApi.get('/bookings/owner');
    return response.data;
  },

  // Accept booking (owner only)
  acceptBooking: async (id) => {
    const response = await ownerApi.put(`/bookings/${id}/accept`);
    return response.data;
  },

  // Update booking status (accept/reject) - owner only
  updateBookingStatus: async (bookingId, status) => {
    if (status === 'ACCEPTED') {
      const response = await ownerApi.put(`/bookings/${bookingId}/accept`);
      return response.data;
    } else if (status === 'REJECTED') {
      const response = await ownerApi.put(`/bookings/${bookingId}/reject`);
      return response.data;
    } else {
      throw new Error(`Invalid status: ${status}. Only ACCEPTED and REJECTED are supported.`);
    }
  },

  // Cancel booking (traveler)
  cancelBooking: async (id) => {
    const response = await bookingApi.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Cancel booking (owner)
  cancelBookingOwner: async (id) => {
    const response = await ownerApi.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Get blocked dates for a property
  getBlockedDates: async (propertyId) => {
    const response = await bookingApi.get(`/bookings/property/${propertyId}/blocked-dates`);
    return response.data;
  }
};

