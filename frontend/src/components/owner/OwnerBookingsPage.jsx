import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBookings, updateBookingStatus, cancelBooking, setStatusFilter } from '../../store/slices/bookingSlice';
import AirbnbHeader from '../common/AirbnbHeader';
import { getImageUrl } from '../../utils/imageUtils';
import './OwnerBookingsPage.css';

const OwnerBookingsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { bookings, statusFilter, loading: bookingLoading, error: bookingError } = useAppSelector((state) => state.booking);

  // Fetch bookings on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBookings('owner'));
    }
  }, [dispatch, isAuthenticated]);

  // Filter bookings based on status
  const getFilteredBookings = () => {
    if (statusFilter === 'all') {
      return bookings;
    }
    if (statusFilter === 'cancelled') {
      // Show both cancelled and rejected bookings under "cancelled"
      return bookings.filter(booking => {
        const bookingStatus = (booking.status || '').toLowerCase();
        return bookingStatus === 'cancelled' || bookingStatus === 'rejected';
      });
    }
    return bookings.filter(booking => {
      const bookingStatus = (booking.status || '').toLowerCase();
      return bookingStatus === statusFilter.toLowerCase();
    });
  };

  const handleStatusFilterChange = (filter) => {
    dispatch(setStatusFilter(filter));
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const result = await dispatch(updateBookingStatus({ bookingId, status: 'ACCEPTED' }));
      
      if (updateBookingStatus.fulfilled.match(result)) {
        alert('Booking accepted successfully!');
        await dispatch(fetchBookings('owner'));
        dispatch(setStatusFilter('accepted'));
      } else {
        const errorMessage = result.payload || 'Failed to accept booking';
        alert(`Failed to accept booking: ${errorMessage}`);
      }
    } catch (err) {
      alert(`Failed to accept booking: ${err.message || 'Unknown error'}`);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) {
      return;
    }

    try {
      const result = await dispatch(updateBookingStatus({ bookingId, status: 'REJECTED' }));
      
      if (updateBookingStatus.fulfilled.match(result)) {
        alert('Booking rejected successfully!');
        await dispatch(fetchBookings('owner'));
      } else {
        const errorMessage = result.payload || 'Failed to reject booking';
        alert(`Failed to reject booking: ${errorMessage}`);
      }
    } catch (err) {
      alert(`Failed to reject booking: ${err.message || 'Unknown error'}`);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const result = await dispatch(cancelBooking({ bookingId, userType: 'owner' }));
      
      if (cancelBooking.fulfilled.match(result)) {
        await dispatch(fetchBookings('owner'));
        dispatch(setStatusFilter('cancelled'));
        alert('Booking cancelled successfully!');
      } else {
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
        referrer: 'bookings', 
        referrerLabel: 'Bookings',
        referrerPath: '/owner/bookings'
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
    if (statusLower === 'pending') return 'bookings-status-badge pending';
    if (statusLower === 'accepted') return 'bookings-status-badge accepted';
    if (statusLower === 'completed') return 'bookings-status-badge completed';
    // Show both cancelled and rejected as "cancelled"
    if (statusLower === 'cancelled' || statusLower === 'rejected') {
      return 'bookings-status-badge cancelled';
    }
    return 'bookings-status-badge';
  };

  // Check if booking can be accepted/rejected (only pending)
  const canAcceptReject = (status) => {
    const statusLower = (status || '').toLowerCase();
    return statusLower === 'pending';
  };

  return (
    <div className="owner-bookings-page">
      <AirbnbHeader />
      
      <div className="bookings-container">
        <div className="bookings-header">
          <h1 className="bookings-title">Your bookings</h1>
        </div>

        {/* Filter Tabs */}
        <div className="bookings-filter-tabs">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(filter => (
            <button
              key={filter}
              className={`bookings-filter-tab ${statusFilter === filter ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bookings-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading your bookings...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bookings-error">
            <div className="error-icon">⚠️</div>
            <h3>Error loading bookings</h3>
            <p>{error}</p>
            <button 
              className="btn-retry"
              onClick={() => dispatch(fetchBookings('owner'))}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="bookings-empty-state">
            <div className="empty-icon">📅</div>
            <h2>
              {statusFilter === 'all' 
                ? "No bookings found" 
                : `No ${statusFilter} bookings found`}
            </h2>
            <p>
              {statusFilter === 'all'
                ? "You don't have any bookings for your properties yet."
                : `You don't have any ${statusFilter} bookings at the moment.`}
            </p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="bookings-list">
            {filteredBookings.map(booking => {
              const property = booking.property || booking.propertyId;
              const propertyId = property?.id || property?._id || booking.propertyId;
              const bookingId = booking.id || booking._id;
              const nights = calculateNights(booking.startDate, booking.endDate);
              const firstImage = property?.images?.[0] || property?.image;
              const traveler = booking.travelerId || booking.traveler;

              return (
                <div key={bookingId} className="bookings-card">
                  {/* Property Image */}
                  {firstImage && (
                    <div 
                      className="bookings-card-image"
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
                  <div className="bookings-card-content">
                    <div className="bookings-card-header">
                      <div>
                        <h3 
                          className="bookings-card-title"
                          onClick={() => handleViewProperty(propertyId)}
                        >
                          {property?.name || 'Property'}
                        </h3>
                        <p className="bookings-card-location">
                          {property?.city}{property?.state ? `, ${property.state}` : property?.country ? `, ${property.country}` : ''}
                        </p>
                        {traveler && typeof traveler === 'object' && traveler.name && (
                          <p className="bookings-card-traveler">
                            Guest: {traveler.name}
                          </p>
                        )}
                      </div>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {(() => {
                          const status = (booking.status || 'PENDING').toUpperCase();
                          // Show "CANCELLED" for both cancelled and rejected
                          return status === 'REJECTED' ? 'CANCELLED' : status;
                        })()}
                      </span>
                    </div>

                    <div className="bookings-card-details">
                      <div className="bookings-detail-item">
                        <span className="bookings-detail-icon">📅</span>
                        <span>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          {nights > 0 && ` · ${nights} ${nights === 1 ? 'night' : 'nights'}`}
                        </span>
                      </div>
                      <div className="bookings-detail-item">
                        <span className="bookings-detail-icon">👥</span>
                        <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                      </div>
                      <div className="bookings-detail-item">
                        <span className="bookings-detail-icon">💰</span>
                        <span>${booking.totalPrice || '0'}</span>
                      </div>
                    </div>

                    <div className="bookings-card-actions">
                      {canAcceptReject(booking.status) && (
                        <>
                          <button
                            className="btn-accept"
                            onClick={() => handleAcceptBooking(bookingId)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleRejectBooking(bookingId)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {booking.status?.toLowerCase() === 'accepted' && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancelBooking(bookingId)}
                        >
                          Cancel
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

export default OwnerBookingsPage;

