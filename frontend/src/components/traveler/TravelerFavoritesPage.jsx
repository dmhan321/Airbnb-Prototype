import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFavorites } from '../../store/slices/propertySlice';
import PropertyCardEnhanced from './PropertyCardEnhanced';
import AirbnbHeader from '../common/AirbnbHeader';
import './TravelerFavoritesPage.css';

const TravelerFavoritesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { favorites, loading: propertyLoading, error: propertyError } = useAppSelector((state) => state.property);

  // Fetch favorites on mount - only if user is a traveler
  useEffect(() => {
    if (isAuthenticated && user?.userType === 'traveler') {
      dispatch(fetchFavorites());
    } else if (isAuthenticated && user?.userType !== 'traveler') {
      // Redirect owners away from favorites page
      navigate('/owner');
    }
  }, [dispatch, isAuthenticated, user, navigate]);

  const handleFavoriteChange = (propertyId, isFavorited) => {
    // Favorite state is managed by Redux
    // When a favorite is removed, the favorites array will update automatically
    // Re-fetch to ensure we have the latest data
    if (!isFavorited) {
      dispatch(fetchFavorites());
    }
  };

  const handleExploreProperties = () => {
    navigate('/');
  };

  // Extract property objects from favorites
  const favoriteProperties = favorites.map(favorite => {
    // Handle different favorite object structures
    return favorite.property || favorite.Property || favorite;
  }).filter(property => property); // Remove any null/undefined properties

  const loading = propertyLoading;
  const error = propertyError;

  return (
    <div className="traveler-favorites-page">
      <AirbnbHeader />
      
      <div className="favorites-container">
        <div className="favorites-header">
          <h1 className="favorites-title">Your favorites</h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="favorites-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading your favorites...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="favorites-error">
            <div className="error-icon">⚠️</div>
            <h3>Error loading favorites</h3>
            <p>{error}</p>
            <button 
              className="btn-retry"
              onClick={() => dispatch(fetchFavorites())}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favoriteProperties.length === 0 && (
          <div className="favorites-empty-state">
            <div className="empty-icon">❤️</div>
            <h2>You haven't saved any favorites yet</h2>
            <p>Start exploring and save your favorite properties to see them here.</p>
            <button 
              className="btn-explore"
              onClick={handleExploreProperties}
            >
              Explore properties
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && !error && favoriteProperties.length > 0 && (
          <div className="favorites-grid">
            {favoriteProperties.map(property => (
              <PropertyCardEnhanced 
                key={property.id || property._id} 
                property={property}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelerFavoritesPage;

