import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProperties, searchProperties, fetchFavorites } from '../../store/slices/propertySlice';
import PropertyCardEnhanced from './PropertyCardEnhanced';
import AirbnbHeader from '../common/AirbnbHeader';
import InlineSearchBar from '../common/InlineSearchBar';
import './TravelerDashboardEnhanced.css';

const TravelerDashboardEnhanced = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { properties, searchResults, viewedProperties, loading: propertyLoading } = useAppSelector((state) => state.property);

  // Get search filters from URL - memoized to prevent unnecessary re-renders
  const filters = useMemo(() => {
    return {
      location: searchParams.get('location') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      guests: searchParams.get('guests') || ''
    };
  }, [searchParams]);

  // Load data on mount
  useEffect(() => {
    const hasFilters = filters.location || filters.startDate || filters.endDate || filters.guests;

    if (hasFilters) {
      dispatch(searchProperties(filters));
    } else {
      dispatch(fetchProperties());
    }

    // Load favorites if authenticated and user is a traveler
    if (isAuthenticated && user?.userType === 'traveler') {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated, user, filters]);

  // Re-search when URL params change
  useEffect(() => {
    const hasFilters = filters.location || filters.startDate || filters.endDate || filters.guests;

    if (hasFilters) {
      dispatch(searchProperties(filters));
    } else {
      dispatch(fetchProperties());
    }
  }, [searchParams, dispatch, filters]);

  const hasFilters = filters.location || filters.startDate || filters.endDate || filters.guests;
  const displayProperties = hasFilters ? searchResults : properties;
  const loading = propertyLoading;

  const handleFavoriteChange = (propertyId, isFavorited) => {
    // Favorite state is managed by Redux
  };

  // Get recently viewed properties
  const recentlyViewed = properties.filter(p => 
    viewedProperties.includes(p.id || p._id)
  ).slice(0, 6);

  return (
    <div className="traveler-dashboard-page">
      <AirbnbHeader />
      
      <div className="dashboard-container">
        {/* Hero Section */}
        {isAuthenticated && user?.userType === 'traveler' && (
          <div className="dashboard-hero">
            <h1 className="dashboard-hero-title">Welcome back, {user.name}!</h1>
            <p className="dashboard-hero-subtitle">Where would you like to go next?</p>
          </div>
        )}

        {/* Inline Search Bar */}
        <div className="dashboard-search-section">
          <InlineSearchBar />
        </div>

        {/* Explore Properties Section */}
        <div className="dashboard-section">
          {hasFilters ? (
            <h2 className="dashboard-section-title">Search Results</h2>
          ) : (
            <h2 className="dashboard-section-title">Explore properties</h2>
          )}
          
          {loading ? (
            <div className="dashboard-loading">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : displayProperties.length === 0 ? (
            <div className="dashboard-empty-state">
              <h3>No properties found</h3>
              <p>{hasFilters ? 'Try adjusting your search criteria.' : 'No properties available at the moment.'}</p>
            </div>
          ) : (
            <div className="dashboard-properties-grid">
              {displayProperties.map(property => (
                <PropertyCardEnhanced 
                  key={property.id || property._id} 
                  property={property}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed Section */}
        {isAuthenticated && recentlyViewed.length > 0 && (
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Recently viewed</h2>
            <div className="dashboard-properties-grid">
              {recentlyViewed.map(property => (
                <PropertyCardEnhanced 
                  key={property.id || property._id} 
                  property={property}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelerDashboardEnhanced;

