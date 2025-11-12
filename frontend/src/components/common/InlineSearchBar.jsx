import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import './InlineSearchBar.css';

const InlineSearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    startDate: '',
    endDate: '',
    guests: ''
  });
  const lastSyncedUrlRef = useRef('');

  // Initialize filters from URL params when pathname changes or URL params change (but not during typing)
  useEffect(() => {
    const currentUrl = searchParams.toString();
    
    // Only sync if URL actually changed (navigation, not typing)
    if (currentUrl !== lastSyncedUrlRef.current) {
      const filters = {
        location: searchParams.get('location') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        guests: searchParams.get('guests') || ''
      };
      setSearchFilters(filters);
      lastSyncedUrlRef.current = currentUrl;
    }
  }, [location.pathname, searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Build search URL with query parameters
    const params = new URLSearchParams();
    if (searchFilters.location) params.set('location', searchFilters.location);
    if (searchFilters.startDate) params.set('startDate', searchFilters.startDate);
    if (searchFilters.endDate) params.set('endDate', searchFilters.endDate);
    if (searchFilters.guests) params.set('guests', searchFilters.guests);

    // Update URL params but stay on homepage
    navigate(`/?${params.toString()}`, { replace: true });
  };

  return (
    <div className="inline-search-bar-container">
      <form className="inline-search-bar-form" onSubmit={handleSubmit}>
        <div className="inline-search-bar-content">
          <div className="inline-search-item">
            <label className="inline-search-label">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Location
            </label>
            <input
              type="text"
              name="location"
              className="inline-search-input"
              placeholder="Where to?"
              value={searchFilters.location}
              onChange={handleInputChange}
            />
          </div>
          <div className="inline-search-divider"></div>
          <div className="inline-search-item">
            <label className="inline-search-label">Check in</label>
            <input
              type="date"
              name="startDate"
              className="inline-search-input"
              value={searchFilters.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="inline-search-divider"></div>
          <div className="inline-search-item">
            <label className="inline-search-label">Check out</label>
            <input
              type="date"
              name="endDate"
              className="inline-search-input"
              value={searchFilters.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="inline-search-divider"></div>
          <div className="inline-search-item">
            <label className="inline-search-label">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17.5c-.8 0-1.54.5-1.85 1.26L14.15 13H12v5h2v6h6z"/>
              </svg>
              Guests
            </label>
            <input
              type="number"
              name="guests"
              className="inline-search-input"
              placeholder="Add guests"
              min="1"
              value={searchFilters.guests}
              onChange={handleInputChange}
            />
          </div>
          <button 
            type="submit"
            className="inline-search-button"
          >
            <svg viewBox="0 0 32 32" fill="currentColor" width="16" height="16">
              <path d="M13.5 22c-4.687 0-8.5-3.813-8.5-8.5S8.813 5 13.5 5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5zm0-15c-3.584 0-6.5 2.916-6.5 6.5s2.916 6.5 6.5 6.5 6.5-2.916 6.5-6.5-2.916-6.5-6.5-6.5zM27 27l-7-7" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InlineSearchBar;

