import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBookings, cancelBooking, setStatusFilter } from '../../store/slices/bookingSlice';
import AirbnbHeader from '../common/AirbnbHeader';
import { getImageUrl } from '../../utils/imageUtils';
import './TravelerTripsPage.css';

const TravelerTripsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { bookings, statusFilter, loading: bookingLoading, error: bookingError } = useAppSelector((state) => state.booking);

  // Fetch bookings on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBookings('traveler'));
    }
  }, [dispatch, isAuthenticated]);

  // Filter bookings based on status
  const getFilteredBookings = () => {
    if (statusFilter === 'all') {
      return bookings;
    }
    return bookings.filter(booking => {
      const bookingStatus = (booking.status || '').toLowerCase();
      return bookingStatus === statusFilter.toLowerCase();
    });
  };

  const handleStatusFilterChange = (filter) => {
    dispatch(setStatusFilter(filter));
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const result = await dispatch(cancelBooking({ bookingId, userType: 'traveler' }));
      
      if (cancelBooking.fulfilled.match(result)) {
        // Success - booking status updated to cancelled
        // Re-fetch bookings to ensure consistency
        await dispatch(fetchBookings('traveler'));
        
        // Auto-switch to "Cancelled" filter so user can see their cancelled booking
        dispatch(setStatusFilter('cancelled'));
        
        // Show success message
        alert('Booking cancelled successfully!');
      } else {
        // Error occurred
        const errorMessage = result.payload || 'Failed to cancel booking';
        alert(`Failed to cancel booking: ${errorMessage}`);
      }
    } catch (err) {
      alert(`Failed to cancel booking: ${err.message || 'Unknown error'}`);
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`, {
      state: { 
        referrer: 'trips', 
        referrerLabel: 'Trips',
        referrerPath: '/traveler/trips'
      }
    });
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Calculate nights
  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredBookings = getFilteredBookings();
  const loading = bookingLoading;
  const error = bookingError;

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'pending') return 'trips-status-badge pending';
    if (statusLower === 'accepted') return 'trips-status-badge accepted';
    if (statusLower === 'completed') return 'trips-status-badge completed';
    if (statusLower === 'cancelled') return 'trips-status-badge cancelled';
    return 'trips-status-badge';
  };

  // Check if booking can be cancelled
  const canCancelBooking = (status) => {
    const statusLower = (status || '').toLowerCase();
    return statusLower === 'pending' || statusLower === 'accepted';
  };

  return (
    <div className="traveler-trips-page">
      <AirbnbHeader />
      
      <div className="trips-container">
        <div className="trips-header">
          <h1 className="trips-title">Your trips</h1>
        </div>

        {/* Filter Tabs */}
        <div className="trips-filter-tabs">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(filter => (
            <button
              key={filter}
              className={`trips-filter-tab ${statusFilter === filter ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="trips-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading your trips...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="trips-error">
            <div className="error-icon">⚠️</div>
            <h3>Error loading trips</h3>
            <p>{error}</p>
            <button 
              className="btn-retry"
              onClick={() => dispatch(fetchBookings('traveler'))}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="trips-empty-state">
            <div className="empty-icon">🧳</div>
            <h2>
              {statusFilter === 'all' 
                ? "No trips found" 
                : `No ${statusFilter} trips found`}
            </h2>
            <p>
              {statusFilter === 'all'
                ? "Start exploring and book your first trip!"
                : `You don't have any ${statusFilter} trips at the moment.`}
            </p>
            {statusFilter === 'all' && (
              <button 
                className="btn-explore"
                onClick={() => navigate('/')}
              >
                Explore properties
              </button>
            )}
          </div>
        )}

        {/* Trips List */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="trips-list">
            {filteredBookings.map(booking => {
              const property = booking.property || booking.propertyId;
              const propertyId = property?.id || property?._id || booking.propertyId;
              const bookingId = booking.id || booking._id;
              const nights = calculateNights(booking.startDate, booking.endDate);
              const firstImage = property?.images?.[0] || property?.image;

              return (
                <div key={bookingId} className="trips-card">
                  {/* Property Image */}
                  {firstImage && (
                    <div 
                      className="trips-card-image"
                      onClick={() => handleViewProperty(propertyId)}
                    >
                      <img 
                        src={getImageUrl(firstImage)} 
                        alt={property?.name || 'Property'}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="trips-card-content">
                    <div className="trips-card-header">
                      <div>
                        <h3 
                          className="trips-card-title clickable"
                          onClick={() => handleViewProperty(propertyId)}
                        >
                          {property?.name || 'Property'}
                        </h3>
                        <p className="trips-card-location">
                          {property?.city}{property?.state ? `, ${property.state}` : property?.country ? `, ${property.country}` : ''}
                        </p>
                      </div>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status || 'PENDING'}
                      </span>
                    </div>

                    <div className="trips-card-details">
                      <div className="trips-detail-item">
                        <span className="trips-detail-icon">📅</span>
                        <span>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          {nights > 0 && ` · ${nights} ${nights === 1 ? 'night' : 'nights'}`}
                        </span>
                      </div>
                      <div className="trips-detail-item">
                        <span className="trips-detail-icon">👥</span>
                        <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                      </div>
                      <div className="trips-detail-item">
                        <span className="trips-detail-icon">💰</span>
                        <span>${booking.totalPrice || '0'}</span>
                      </div>
                    </div>

                    <div className="trips-card-actions">
                      {canCancelBooking(booking.status) && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancelBooking(bookingId)}
                        >
                          Cancel booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelerTripsPage;

