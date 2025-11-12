import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { searchProperties, clearSearchResults, fetchProperties } from '../../store/slices/propertySlice';
import AirbnbHeader from './AirbnbHeader';
import InlineSearchBar from './InlineSearchBar';
import PropertyCardEnhanced from '../traveler/PropertyCardEnhanced';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { searchResults, loading, error } = useAppSelector((state) => state.property);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [hasSearched, setHasSearched] = useState(false);

  // Extract search filters from URL
  const getSearchFilters = () => {
    return {
      location: searchParams.get('location') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      guests: searchParams.get('guests') || ''
    };
  };

  // Perform search when component mounts or URL params change
  useEffect(() => {
    const filters = getSearchFilters();
    const hasFilters = filters.location || filters.startDate || filters.endDate || filters.guests;

    if (hasFilters) {
      setHasSearched(true);
      dispatch(searchProperties(filters));
    } else {
      // If no filters, show all available properties
      setHasSearched(true);
      dispatch(fetchProperties());
    }

    // Cleanup: clear search results when leaving page
    return () => {
      // Optional: keep results for better UX when navigating back
      // dispatch(clearSearchResults());
    };
  }, [searchParams, dispatch]);

  const filters = getSearchFilters();
  const hasFilters = filters.location || filters.startDate || filters.endDate || filters.guests;
  // Use searchResults if there are filters, otherwise use properties from fetchProperties
  const { properties } = useAppSelector((state) => state.property);
  const displayResults = hasFilters ? searchResults : properties;
  const resultsCount = displayResults.length;

  const handleFavoriteChange = (propertyId, isFavorited) => {
    // Favorite state is managed by Redux
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatGuests = (guests) => {
    if (!guests) return '';
    return `${guests} ${guests === '1' ? 'guest' : 'guests'}`;
  };

  return (
    <div className="search-results-page">
      <AirbnbHeader />
      <InlineSearchBar />

      <div className="search-results-container">
        {/* Applied Filters Display */}
        {hasFilters && (
          <div className="search-filters-display">
            <div className="search-filters-header">
              <h2>Search Results</h2>
              {hasSearched && (
                <span className="search-results-count">
                  {loading ? 'Searching...' : `${resultsCount} ${resultsCount === 1 ? 'property' : 'properties'} found`}
                </span>
              )}
            </div>
            <div className="search-filters-applied">
              {filters.location && (
                <div className="search-filter-chip">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>{filters.location}</span>
                </div>
              )}
              {filters.startDate && (
                <div className="search-filter-chip">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                  </svg>
                  <span>Check in: {formatDate(filters.startDate)}</span>
                </div>
              )}
              {filters.endDate && (
                <div className="search-filter-chip">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                  </svg>
                  <span>Check out: {formatDate(filters.endDate)}</span>
                </div>
              )}
              {filters.guests && (
                <div className="search-filter-chip">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17.5c-.8 0-1.54.5-1.85 1.26L14.15 13H12v5h2v6h6z"/>
                  </svg>
                  <span>{formatGuests(filters.guests)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="search-results-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Searching properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="search-results-error">
            <div className="error-icon">⚠️</div>
            <h3>Search Error</h3>
            <p>{error}</p>
            <button 
              className="btn-retry"
              onClick={() => {
                const filters = getSearchFilters();
                dispatch(searchProperties(filters));
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State - No Search */}
        {!hasFilters && !loading && (
          <div className="search-results-empty">
            <div className="empty-icon">🔍</div>
            <h3>Start your search</h3>
            <p>Enter a location, dates, and number of guests to find the perfect place to stay.</p>
            <button 
              className="btn-browse"
              onClick={() => navigate('/')}
            >
              Browse All Properties
            </button>
          </div>
        )}

        {/* Empty State - No Results */}
        {hasSearched && !loading && !error && resultsCount === 0 && (
          <div className="search-results-empty">
            <div className="empty-icon">🏠</div>
            <h3>No properties found</h3>
            <p>Try adjusting your search criteria:</p>
            <ul className="search-suggestions">
              <li>Try a different location</li>
              <li>Adjust your dates</li>
              <li>Change the number of guests</li>
              <li>Remove some filters</li>
            </ul>
            <button 
              className="btn-browse"
              onClick={() => navigate('/')}
            >
              Browse All Properties
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && resultsCount > 0 && (
          <div className="search-results-grid">
            {displayResults.map(property => (
              <PropertyCardEnhanced
                key={property.id || property._id}
                property={property}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}

        {/* Login Prompt for Logged-Out Users */}
        {!isAuthenticated && resultsCount > 0 && (
          <div className="search-login-prompt">
            <div className="login-prompt-content">
              <h4>Want to save your favorites?</h4>
              <p>Sign in to add properties to your favorites and book your stay.</p>
              <div className="login-prompt-actions">
                <button 
                  className="btn-login"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </button>
                <button 
                  className="btn-signup"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;


