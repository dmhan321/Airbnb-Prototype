import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFavorite, removeFavorite, fetchFavorites } from '../../store/slices/propertySlice';
import { getImageUrl } from '../../utils/imageUtils';
import './PropertyCardEnhanced.css';

const PropertyCardEnhanced = ({ property, onFavoriteChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { favoriteIds } = useAppSelector((state) => state.property);
  const propertyId = property.id || property._id;
  const isFavorited = favoriteIds.includes(propertyId);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    // Determine referrer based on current location
    let referrer = 'home';
    let referrerLabel = 'Home';
    
    if (location.pathname === '/traveler/favorites') {
      referrer = 'favorites';
      referrerLabel = 'Favorites';
    } else if (location.pathname === '/traveler/trips') {
      referrer = 'trips';
      referrerLabel = 'Trips';
    } else if (location.pathname === '/search') {
      referrer = 'search';
      referrerLabel = 'Search results';
    } else if (location.pathname === '/' || location.pathname === '/traveler') {
      referrer = 'home';
      referrerLabel = 'Home';
    }
    
    navigate(`/property/${property.id}`, {
      state: { referrer, referrerLabel, referrerPath: location.pathname }
    });
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated || !user) {
      // Navigate to login if not authenticated
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isFavorited) {
        const favoritesResult = await dispatch(fetchFavorites());
        if (favoritesResult.type === 'property/fetchFavorites/fulfilled') {
          const favorites = favoritesResult.payload;
          const favorite = favorites.find(fav => {
            const favPropertyId = fav.property?.id || fav.propertyId || fav.property?._id;
            return favPropertyId === propertyId;
          });
          if (favorite) {
            await dispatch(removeFavorite(favorite.id || favorite._id));
            if (onFavoriteChange) {
              onFavoriteChange(propertyId, false);
            }
          }
        }
      } else {
        await dispatch(addFavorite(propertyId));
        if (onFavoriteChange) {
          onFavoriteChange(propertyId, true);
        }
      }
    } catch (err) {
      // Silent fail for favorites
    } finally {
      setLoading(false);
    }
  };

  const mainImage = property.images && property.images.length > 0 ? getImageUrl(property.images[0]) : null;
  const hasMultipleImages = property.images && property.images.length > 1;

  return (
    <div className="airbnb-property-card" onClick={handleCardClick}>
      {/* Image Section - 70% of card */}
      <div className="airbnb-property-card-image">
        {mainImage && !imageError ? (
          <>
            <img
              src={mainImage}
              alt={property.name}
              onError={() => setImageError(true)}
            />
            {/* Price Badge */}
            <div className="airbnb-property-price-badge">
              <span className="airbnb-property-price-amount">${property.price}</span>
              <span className="airbnb-property-price-label">/night</span>
            </div>
            {/* Image Carousel Indicator */}
            {hasMultipleImages && (
              <div className="airbnb-property-image-indicator">
                <svg viewBox="0 0 32 32" fill="white" width="12" height="12">
                  <circle cx="8" cy="16" r="2"/>
                  <circle cx="16" cy="16" r="2"/>
                  <circle cx="24" cy="16" r="2"/>
                </svg>
              </div>
            )}
          </>
        ) : (
          <div className="airbnb-property-card-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        )}
        
        {/* Heart Icon - Floating top right */}
        <button
          className={`airbnb-property-heart ${isFavorited ? 'favorited' : ''} ${loading ? 'loading' : ''}`}
          onClick={handleFavorite}
          disabled={!isAuthenticated || loading}
          title={isAuthenticated ? (isFavorited ? 'Remove from favorites' : 'Add to favorites') : 'Login to add favorites'}
        >
          {isFavorited ? (
            <svg viewBox="0 0 32 32" fill="currentColor" width="24" height="24">
              <path d="M16 28c-.2 0-.4-.1-.5-.2C15.1 27.5 4 18.1 4 10c0-4.4 3.6-8 8-8 2.5 0 4.8 1.2 6.3 3.1C19.2 3.2 21.5 2 24 2c4.4 0 8 3.6 8 8 0 8.1-11.1 17.5-11.5 17.8-.1.1-.3.2-.5.2z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M16 28c-.2 0-.4-.1-.5-.2C15.1 27.5 4 18.1 4 10c0-4.4 3.6-8 8-8 2.5 0 4.8 1.2 6.3 3.1C19.2 3.2 21.5 2 24 2c4.4 0 8 3.6 8 8 0 8.1-11.1 17.5-11.5 17.8-.1.1-.3.2-.5.2z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Content Section - 30% of card */}
      <div className="airbnb-property-card-content">
        <div className="airbnb-property-card-header">
          <h3 className="airbnb-property-name">{property.name}</h3>
        </div>
        
        <div className="airbnb-property-location">
          {property.city}{property.state ? `, ${property.state}` : property.country ? `, ${property.country}` : ''}
        </div>

        <div className="airbnb-property-details">
          {property.bedrooms && (
            <span className="airbnb-property-detail-item">
              {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
            </span>
          )}
          {property.bathrooms && (
            <span className="airbnb-property-detail-item">
              {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
            </span>
          )}
          {property.maxGuests && (
            <span className="airbnb-property-detail-item">
              {property.maxGuests} {property.maxGuests === 1 ? 'guest' : 'guests'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCardEnhanced;

