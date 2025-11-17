import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPropertyById, addFavorite, removeFavorite, fetchFavorites, addViewedProperty } from '../../store/slices/propertySlice';
import { bookingService } from '../../services/bookingService';
import AirbnbHeader from '../common/AirbnbHeader';
import ImageGallery from './ImageGallery';
import BookingWidget from './BookingWidget';
import { getImageUrl } from '../../utils/imageUtils';
import './PropertyDetailsEnhanced.css';

const PropertyDetailsEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Get referrer information from location state
  const referrerState = location.state || {};
  const referrer = referrerState.referrer || 'home';
  const referrerLabel = referrerState.referrerLabel || 'Home';
  const referrerPath = referrerState.referrerPath || '/';
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentProperty, favoriteIds, loading: propertyLoading } = useAppSelector((state) => state.property);
  const property = currentProperty;
  const loading = propertyLoading;
  const [error, setError] = useState('');
  const propertyId = property?.id || property?._id || id;
  const isFavorited = favoriteIds.includes(propertyId);
  const [blockedDates, setBlockedDates] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Check if current user is the property owner
  // Travelers should always see traveler view, even if they somehow own the property
  // Only show owner view if user is an owner AND viewing their own property AND not coming from traveler pages
  const isTraveler = user?.userType === 'traveler' || (isAuthenticated && user && user?.userType !== 'owner');
  const isOwner = !isTraveler && 
                  referrer !== 'trips' && 
                  referrer !== 'home' && 
                  referrer !== 'favorites' && 
                  referrer !== 'search' &&
                  isAuthenticated && 
                  user && 
                  property && (
    user.id === property.ownerId || 
    user._id === property.ownerId ||
    (typeof property.ownerId === 'object' && (
      user.id === property.ownerId._id || 
      user._id === property.ownerId._id ||
      user.id === property.ownerId.id ||
      user._id === property.ownerId.id
    ))
  );

  // Get blocked dates from existing bookings
  const getBlockedDates = useCallback(async () => {
    try {
      const data = await bookingService.getBlockedDates(id);
      
      if (data.success && data.blockedDates) {
        setBlockedDates(data.blockedDates);
      } else {
        setBlockedDates([]);
      }
    } catch (err) {
      setBlockedDates([]);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
      dispatch(addViewedProperty(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      // Always fetch blocked dates (public endpoint)
      getBlockedDates();
      
      // Only fetch favorites if authenticated
      if (isAuthenticated && user) {
        dispatch(fetchFavorites());
      }
    }
  }, [id, isAuthenticated, user?.id, getBlockedDates, dispatch]);

  const handleFavorite = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
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
        }
      }
    } else {
      await dispatch(addFavorite(propertyId));
    }
  };

  if (loading) {
    return (
      <div className="property-details-page">
        <AirbnbHeader />
        <div className="property-details-loading">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-details-page">
        <AirbnbHeader />
        <div className="container">
          <div className="property-details-error">
            <h2>Property not found</h2>
            <p>{error || 'The property you are looking for does not exist.'}</p>
            <button className="btn-airbnb" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const description = property.description || '';
  const shouldTruncate = description.length > 300;
  const displayDescription = showFullDescription || !shouldTruncate 
    ? description 
    : description.substring(0, 300) + '...';

  const handleBack = () => {
    // Navigate back to the referrer page
    if (referrerPath && referrerPath !== location.pathname) {
      navigate(referrerPath);
    } else {
      // Fallback: navigate based on referrer type
      switch (referrer) {
        case 'favorites':
          navigate('/traveler/favorites');
          break;
        case 'trips':
          navigate('/traveler/trips');
          break;
        case 'search':
          navigate('/search');
          break;
        default:
          navigate('/');
      }
    }
  };

  const handleEditProperty = () => {
    navigate('/owner/properties', {
      state: { 
        editPropertyId: property.id || property._id,
        referrer: 'property-view',
        referrerPath: `/property/${property.id || property._id}`
      }
    });
  };

  return (
    <div className="property-details-page">
      <AirbnbHeader />
      
      <div className="container property-details-container">
        <div className={`property-details-layout ${isOwner ? 'owner-view' : ''}`}>
          {/* Left Column - 60% Content */}
          <div className="property-details-content">
            {/* Sticky Back Button - Top Right of Images */}
            <div className="property-details-back-button-container">
              <button 
                className="property-details-back-button"
                onClick={handleBack}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Back to {referrerLabel}</span>
              </button>
              {isOwner && (
                <button 
                  className="property-details-edit-button"
                  onClick={handleEditProperty}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>Edit property</span>
                </button>
              )}
            </div>
            
            {/* Image Gallery */}
            <ImageGallery images={property.images || []} />

            {/* Property Header */}
            <div className="property-details-header">
              <div className="property-details-title-section">
                <h1 className="property-details-title">{property.name}</h1>
                <div className="property-details-location">
                  {property.city}, {property.state || property.country}
                </div>
                {/* Price display for owner view */}
                {isOwner && property.price && (
                  <div className="property-details-price">
                    <span className="property-price-amount">${property.price}</span>
                    <span className="property-price-label">/night</span>
                  </div>
                )}
              </div>
              {!isOwner && (
                <button
                  className={`property-details-favorite ${isFavorited ? 'favorited' : ''}`}
                  onClick={handleFavorite}
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
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
              )}
            </div>

            {/* Property Info */}
            <div className="property-details-info">
              <div className="property-details-meta">
                {property.bedrooms && (
                  <div className="property-details-meta-item">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5-10H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="property-details-meta-item">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M9 2C7.34 2 6 3.34 6 5c0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6-4c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                    </svg>
                    <span>{property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
                  </div>
                )}
                {property.maxGuests && (
                  <div className="property-details-meta-item">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17.5c-.8 0-1.54.5-1.85 1.26L14.15 13H12v5h2v6h6z"/>
                    </svg>
                    <span>Up to {property.maxGuests} guests</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stay with Host Section */}
            {property.ownerId && typeof property.ownerId === 'object' && property.ownerId.name && (
              <div className="property-details-stay-with">
                <div className="property-details-stay-with-avatar-container">
                  <div className="property-details-stay-with-avatar">
                    {property.ownerId.profilePicture ? (
                      <img 
                        src={getImageUrl(property.ownerId.profilePicture)} 
                        alt={property.ownerId.name || 'Host'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="property-details-stay-with-avatar-fallback"
                      style={{ display: property.ownerId.profilePicture ? 'none' : 'flex' }}
                    >
                      {property.ownerId.name?.charAt(0).toUpperCase() || 'H'}
                    </div>
                  </div>
                </div>
                <div className="property-details-stay-with-info">
                  <h2 className="property-details-stay-with-title">
                    Stay with {property.ownerId.name || 'Host'}
                  </h2>
                </div>
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="property-details-description">
                <h2>About this place</h2>
                <p>{displayDescription}</p>
                {shouldTruncate && (
                  <button
                    className="property-details-show-more"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}

            {/* Amenities */}
            {property.amenities && (
              <div className="property-details-amenities">
                <h2>What this place offers</h2>
                <div className="property-details-amenities-grid">
                  {(() => {
                    // Handle both string and array formats
                    const amenitiesList = Array.isArray(property.amenities) 
                      ? property.amenities 
                      : typeof property.amenities === 'string' 
                        ? property.amenities.split(',').map(a => a.trim()).filter(a => a)
                        : [];
                    
                    return amenitiesList.map((amenity, index) => (
                      <div key={index} className="property-details-amenity-item">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span>{amenity}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 40% Booking Widget (only if not owner) */}
          {!isOwner && (
            <div className="property-details-booking">
              <BookingWidget 
                property={property} 
                blockedDates={blockedDates}
                onBookingSuccess={getBlockedDates}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsEnhanced;

