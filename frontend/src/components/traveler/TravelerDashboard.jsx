import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { bookingService } from '../../services/bookingService';
import { favoriteService } from '../../services/favoriteService';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import PropertyCard from './PropertyCard';
import PropertySearch from './PropertySearch';
import LoginPrompt from '../common/LoginPrompt';
import SimpleProfileView from '../common/SimpleProfileView';
import SimpleProfileEdit from '../common/SimpleProfileEdit';

const TravelerDashboard = () => {
  const { user, loading: authLoading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);


  const loadAllData = async () => {
    try {
      setLoading(true);
      const [propertiesResponse, bookingsResponse, favoritesResponse, profileResponse] = await Promise.all([
        propertyService.getAllProperties(),
        bookingService.getTravelerBookings(),
        favoriteService.getFavorites(),
        authService.getProfile()
      ]);
      
      setProperties(propertiesResponse.properties || []);
      setBookings(bookingsResponse.bookings || []);
      setFavorites(favoritesResponse.favorites || []);
      
      if (profileResponse.success) {
        setProfileData(profileResponse.user);
      }
    } catch (err) {
      console.error('Load all data error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      const response = await propertyService.searchProperties(filters);
      setProperties(response.properties || []);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };


  // Filter bookings based on status
  const getFilteredBookings = () => {
    if (statusFilter === 'all') {
      return bookings;
    }
    return bookings.filter(booking => booking.status.toLowerCase() === statusFilter.toLowerCase());
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const response = await bookingService.cancelBooking(bookingId);
      if (response.success) {
        loadAllData(); // Reload all data
        alert('Booking cancelled successfully!');
      } else {
        alert(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
      alert('Failed to cancel booking');
    }
  };

  // Remove favorite handler
  const handleRemoveFavorite = async (propertyId) => {
    try {
      await favoriteService.removeFavorite(propertyId);
      loadAllData(); // Reload all data
    } catch (err) {
      console.error('Remove favorite error:', err);
      alert('Failed to remove from favorites');
    }
  };

  // Simple profile save handler
  const handleProfileSave = (updatedUser) => {
    setProfileData(updatedUser);
    updateUser(updatedUser);
    setIsEditingProfile(false);
  };

  // Profile edit handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return <LoginPrompt message="Please log in to search and book properties" />;
  }

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'favorites', label: 'Favorites' },
    { key: 'profile', label: 'Profile' }
  ];

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="row">
              <div className="col-12">
                <div className="mb-4">
                  <h2>Welcome back, {user.name}!</h2>
                  <p className="text-muted">Search and book your next stay</p>
                </div>
                <PropertySearch onSearch={handleSearch} />
              </div>
            </div>
            
            <div className="row mt-4">
              <div className="col-12">
                {properties.length === 0 ? (
                  <div className="alert alert-info">No properties found</div>
                ) : (
                  <div className="row">
                    {properties.map(property => (
                      <div key={property.id} className="col-md-6 col-lg-4 mb-4">
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'bookings':
        return (
          <>
            <div className="row">
              <div className="col-12">
                <h2>Booking History</h2>
                
                {/* Status Filter Tabs */}
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${statusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('all')}
                    >
                      All
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${statusFilter === 'pending' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('pending')}
                    >
                      Pending
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${statusFilter === 'accepted' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('accepted')}
                    >
                      Accepted
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${statusFilter === 'completed' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('completed')}
                    >
                      Completed
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${statusFilter === 'cancelled' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('cancelled')}
                    >
                      Cancelled
                    </button>
                  </li>
                </ul>

                {getFilteredBookings().length === 0 ? (
                  <p className="text-muted">
                    {statusFilter === 'all' ? 'No booking history' : `No ${statusFilter} bookings`}
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Property</th>
                          <th>Dates</th>
                          <th>Guests</th>
                          <th>Total Price</th>
                          <th>Status</th>
                          <th>Booked On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredBookings().map(booking => (
                          <tr key={booking.id}>
                            <td>
                              <strong>{booking.property?.name || 'Property'}</strong>
                            </td>
                            <td>
                              {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                            </td>
                            <td>{booking.guests}</td>
                            <td>${booking.totalPrice}</td>
                            <td>
                              <span className={`badge ${
                                booking.status === 'PENDING' ? 'bg-warning' :
                                booking.status === 'ACCEPTED' ? 'bg-success' :
                                booking.status === 'COMPLETED' ? 'bg-info' :
                                'bg-danger'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td>{formatDate(booking.createdAt)}</td>
                            <td>
                              {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                                      handleCancelBooking(booking.id);
                                    }
                                  }}
                                >
                                  Cancel Booking
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'favorites':
        return (
          <>
            <div className="row">
              <div className="col-12">
                <h2>Favorite Properties</h2>
                {favorites.length === 0 ? (
                  <p className="text-muted">No favorite properties</p>
                ) : (
                  <div className="row">
                    {favorites.map(favorite => {
                      const property = favorite.property || favorite.Property || favorite;
                      return (
                        <div key={favorite.id} className="col-md-6 mb-3">
                          <div className="card h-100">
                            {/* Property Photo */}
                            {property?.images && property.images.length > 0 && (
                              <div className="card-img-top" style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                  src={property.images[0]}
                                  alt={property.name}
                                  className="w-100 h-100"
                                  style={{ objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <div className="card-body">
                              <h6>{property?.name || 'Property'}</h6>
                              <p className="card-text">
                                <strong>Type:</strong> {property?.type || 'N/A'}<br/>
                                <strong>Location:</strong> {property?.city || 'N/A'}, {property?.country || 'N/A'}<br/>
                                <strong>Price:</strong> ${property?.price || 'N/A'}/night<br/>
                                <strong>Bedrooms:</strong> {property?.bedrooms || 'N/A'} | <strong>Bathrooms:</strong> {property?.bathrooms || 'N/A'}
                              </p>
                              {property?.description && (
                                <p className="card-text text-muted">{property.description.substring(0, 100)}...</p>
                              )}
                              <div className="d-flex justify-content-between align-items-center">
                                <a href={`/property/${property?.id}`} className="btn btn-outline-primary btn-sm">
                                  View Details
                                </a>
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleRemoveFavorite(property?.id)}
                                >
                                  ❤️ Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'profile':
        return (
          <>
            <div className="row">
              <div className="col-12">
                <h2>Profile Information</h2>
                {profileData ? (
                  isEditingProfile ? (
                    <SimpleProfileEdit 
                      user={profileData} 
                      onSave={handleProfileSave}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <SimpleProfileView 
                      user={profileData} 
                      onEdit={handleEditProfile} 
                    />
                  )
                ) : (
                  <div className="alert alert-info">Loading profile...</div>
                )}
              </div>
            </div>
          </>
        );

      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="container-fluid px-3">
          <div className="d-flex justify-content-between align-items-center py-3">
            <h4 className="mb-0">🏠 Airbnb Prototype</h4>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={async () => {
                try {
                  await logout();
                  navigate('/');
                } catch (err) {
                  console.error('Logout error:', err);
                  navigate('/');
                }
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-light border-bottom">
        <div className="container-fluid px-3">
          <ul className="nav nav-tabs border-0">
            {tabs.map(tab => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content */}
      <div className="container-fluid px-3 py-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TravelerDashboard;
