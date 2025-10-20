import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { bookingService } from '../../services/bookingService';
import OwnerProfileEditForm from './OwnerProfileEditForm';

const OwnerProfile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profileResponse, bookingsResponse] = await Promise.all([
        authService.getProfile(),
        bookingService.getOwnerBookings()
      ]);

      if (profileResponse.success) {
        setUser(profileResponse.user);
      }

      if (bookingsResponse.success) {
        setBookings(bookingsResponse.bookings || []);
      }
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await bookingService.acceptBooking(bookingId);
      if (response.success) {
        loadUserData(); // Reload data
        alert('Booking accepted successfully!');
      }
    } catch (err) {
      setError('Failed to accept booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await bookingService.cancelBooking(bookingId);
      if (response.success) {
        loadUserData(); // Reload data
        alert('Booking cancelled successfully!');
      }
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Owner Profile</h2>
            <div>
              <a href="/owner" className="btn btn-outline-primary me-2">
                🏠 Home
              </a>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs" id="ownerTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Booking Requests
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content mt-3">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                      <div className="card">
                        <div className="card-body">
                          <div className="row mb-4">
                            <div className="col-12">
                              <h5>Profile Information</h5>
                            </div>
                          </div>
                          {user && (
                            <OwnerProfileEditForm
                              user={user}
                              onUpdate={loadUserData}
                            />
                          )}
                        </div>
                      </div>
                    )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="card">
                <div className="card-body">
                  <h5>Booking Requests</h5>
                  {bookings.length === 0 ? (
                    <p className="text-muted">No booking requests</p>
                  ) : (
                    <div className="row">
                      {bookings.map(booking => {
                        // Format dates to MM/DD/YYYY
                        const formatDate = (dateString) => {
                          const date = new Date(dateString);
                          return date.toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric'
                          });
                        };

                        return (
                          <div key={booking.id} className="col-md-6 mb-3">
                            <div className="card">
                              <div className="card-body">
                                <h6>{booking.property?.name || 'Property'}</h6>
                                <p><strong>Traveler:</strong> {booking.Traveler?.name}</p>
                                <p><strong>Dates:</strong> {formatDate(booking.startDate)} to {formatDate(booking.endDate)}</p>
                                <p><strong>Guests:</strong> {booking.guests}</p>
                                <p><strong>Status:</strong> 
                                  <span className={`badge ms-2 ${
                                    booking.status === 'PENDING' ? 'bg-warning' :
                                    booking.status === 'ACCEPTED' ? 'bg-success' :
                                    'bg-danger'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </p>
                                <p><strong>Total:</strong> ${booking.totalPrice}</p>
                                <p><strong>Requested:</strong> {formatDate(booking.createdAt)}</p>
                              
                              {booking.status === 'PENDING' && (
                                <div className="mt-2">
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleAcceptBooking(booking.id)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to cancel this booking request?')) {
                                        handleCancelBooking(booking.id);
                                      }
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                              
                              {/* Cancel button for accepted bookings */}
                              {booking.status === 'ACCEPTED' && (
                                <div className="mt-2">
                                  <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to cancel this accepted booking?')) {
                                        handleCancelBooking(booking.id);
                                      }
                                    }}
                                  >
                                    Cancel Booking
                                  </button>
                                </div>
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
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="card">
                <div className="card-body">
                  <h5>Owner Dashboard</h5>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="card bg-primary text-white">
                        <div className="card-body">
                          <h5>Total Bookings</h5>
                          <h3>{bookings.length}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-success text-white">
                        <div className="card-body">
                          <h5>Accepted Bookings</h5>
                          <h3>{bookings.filter(b => b.status === 'ACCEPTED').length}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-warning text-white">
                        <div className="card-body">
                          <h5>Pending Requests</h5>
                          <h3>{bookings.filter(b => b.status === 'PENDING').length}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
