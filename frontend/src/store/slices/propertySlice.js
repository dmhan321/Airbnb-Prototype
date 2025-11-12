import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { propertyService } from '../../services/propertyService';
import { favoriteService } from '../../services/favoriteService';

// Async thunks
export const fetchProperties = createAsyncThunk(
  'property/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyService.getAllProperties();
      return response.properties || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

export const searchProperties = createAsyncThunk(
  'property/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await propertyService.searchProperties(searchParams);
      return response.properties || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'property/fetchById',
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await propertyService.getPropertyById(propertyId);
      return response.property;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property');
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'property/fetchFavorites',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check if user is a traveler before fetching favorites
      const state = getState();
      const userType = state.auth.user?.userType;
      
      if (userType !== 'traveler') {
        // Silently return empty array if user is not a traveler
        return [];
      }
      
      const response = await favoriteService.getFavorites();
      return response.favorites || [];
    } catch (error) {
      // If 403 Forbidden, user is likely not a traveler - return empty array
      if (error.response?.status === 403) {
        return [];
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'property/addFavorite',
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await favoriteService.addFavorite(propertyId);
      return response.favorite;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'property/removeFavorite',
  async (favoriteId, { rejectWithValue }) => {
    try {
      await favoriteService.removeFavorite(favoriteId);
      return favoriteId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove favorite');
    }
  }
);

const initialState = {
  properties: [],
  searchResults: [],
  currentProperty: null,
  favorites: [],
  favoriteIds: [], // Array of property IDs that are favorited
  viewedProperties: [],
  loading: false,
  error: null,
  searchParams: null,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchParams = null;
    },
    addViewedProperty: (state, action) => {
      const propertyId = action.payload;
      if (!state.viewedProperties.includes(propertyId)) {
        state.viewedProperties.push(propertyId);
      }
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search properties
      .addCase(searchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch property by ID
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload;
        // Add to viewed properties
        if (action.payload?.id && !state.viewedProperties.includes(action.payload.id)) {
          state.viewedProperties.push(action.payload.id);
        }
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
        // Update favoriteIds array
        state.favoriteIds = action.payload
          .map(fav => fav.property?.id || fav.propertyId)
          .filter(id => id); // Remove undefined/null values
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        const propertyId = action.payload.property?.id || action.payload.propertyId;
        if (propertyId && !state.favoriteIds.includes(propertyId)) {
          state.favorites.push(action.payload);
          state.favoriteIds.push(propertyId);
        }
      })
      // Remove favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const favoriteId = action.payload;
        // Find the favorite being removed to get its propertyId
        const removedFavorite = state.favorites.find(
          fav => fav.id === favoriteId || fav._id === favoriteId
        );
        if (removedFavorite) {
          const propertyId = removedFavorite.property?.id || removedFavorite.propertyId;
          // Remove from favorites array
          state.favorites = state.favorites.filter(
            fav => fav.id !== favoriteId && fav._id !== favoriteId
          );
          // Remove from favoriteIds array
          if (propertyId) {
            state.favoriteIds = state.favoriteIds.filter(id => id !== propertyId);
          }
        }
      });
  },
});

export const {
  clearError,
  clearSearchResults,
  addViewedProperty,
  clearCurrentProperty,
  setSearchParams,
} = propertySlice.actions;

export default propertySlice.reducer;

