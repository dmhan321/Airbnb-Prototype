import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/bookingService';

// Async thunks
export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (userType, { rejectWithValue }) => {
    try {
      const response = userType === 'owner' 
        ? await bookingService.getOwnerBookings()
        : await bookingService.getTravelerBookings();
      return response.bookings || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookingById(bookingId);
      return response.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(bookingData);
      if (response.success) {
        return response.booking;
      }
      return rejectWithValue(response.message || response.error || 'Failed to create booking');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create booking';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateStatus',
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBookingStatus(bookingId, status);
      if (response.success) {
        return response.booking;
      }
      return rejectWithValue(response.message || 'Failed to update booking');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async ({ bookingId, userType = 'traveler' }, { rejectWithValue }) => {
    try {
      // Use appropriate service based on userType
      const response = userType === 'owner' 
        ? await bookingService.cancelBookingOwner(bookingId)
        : await bookingService.cancelBooking(bookingId);
      
      if (response.success) {
        // Return the updated booking object if available, otherwise return bookingId
        return response.booking || bookingId;
      }
      return rejectWithValue(response.message || 'Failed to cancel booking');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  statusFilter: 'all', // 'all', 'pending', 'confirmed', 'cancelled', 'completed'
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update booking status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          b => b.id === action.payload.id || b._id === action.payload._id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking && 
            (state.currentBooking.id === action.payload.id || 
             state.currentBooking._id === action.payload._id)) {
          state.currentBooking = action.payload;
        }
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Update booking status to cancelled instead of removing it
        const payload = action.payload;
        const bookingId = payload?.id || payload?._id || payload;
        
        // If payload is a full booking object, use it directly
        if (payload && typeof payload === 'object' && payload.status) {
          const index = state.bookings.findIndex(
            b => (b.id === payload.id || b._id === payload._id)
          );
          if (index !== -1) {
            state.bookings[index] = payload;
          } else {
            // If not found, add it (shouldn't happen, but just in case)
            state.bookings.push(payload);
          }
          
          if (state.currentBooking && 
              (state.currentBooking.id === payload.id || 
               state.currentBooking._id === payload._id)) {
            state.currentBooking = payload;
          }
        } else {
          // If payload is just an ID, update the status manually
          const index = state.bookings.findIndex(
            b => (b.id === bookingId || b._id === bookingId)
          );
          if (index !== -1) {
            state.bookings[index] = {
              ...state.bookings[index],
              status: 'CANCELLED'
            };
          }
          if (state.currentBooking && 
              (state.currentBooking.id === bookingId || 
               state.currentBooking._id === bookingId)) {
            state.currentBooking = {
              ...state.currentBooking,
              status: 'CANCELLED'
            };
          }
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setStatusFilter, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

