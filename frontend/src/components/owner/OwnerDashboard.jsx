import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { bookingService } from '../../services/bookingService';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import PropertyForm from './PropertyForm';
import PropertyList from './PropertyList';
import SimpleProfileView from '../common/SimpleProfileView';
import SimpleProfileEdit from '../common/SimpleProfileEdit';

const OwnerDashboard = () => {
  const { logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [propertiesResponse, bookingsResponse, profileResponse] = await Promise.all([
        propertyService.getOwnerProperties(),
        bookingService.getOwnerBookings(),
        authService.getProfile()
      ]);
      
      setProperties(propertiesResponse.properties || []);
      setBookings(bookingsResponse.bookings || []);
      
      if (profileResponse.success) {
        setProfileData(profileResponse.user);
      }
    } catch (err) {
      console.error('Load all data error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };


  // Tab switching
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  // Property form handlers
  const handlePropertyCreated = () => {
    setShowPropertyForm(false);
    loadAllData();
  };

  // Booking handlers
  const handleAcceptBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to accept this booking?')) {
      return;
    }
    
    try {
      const response = await bookingService.acceptBooking(bookingId);
      if (response.success) {
        alert('Booking accepted successfully!');
        loadAllData();
      } else {
        alert(response.message || 'Failed to accept booking');
      }
    } catch (err) {
      console.error('Accept booking error:', err);
      alert('Failed to accept booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const response = await bookingService.cancelBooking(bookingId);
      if (response.success) {
        alert('Booking cancelled successfully!');
        loadAllData();
      } else {
        alert(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
      alert('Failed to cancel booking');
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

  // Filter bookings by status
  const getFilteredBookings = () => {
    if (statusFilter === 'all') return bookings;
    return bookings.filter(booking => booking.status.toLowerCase() === statusFilter);
  };

  // Calculate dashboard stats
  const totalProperties = properties.length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const acceptedBookings = bookings.filter(b => b.status === 'ACCEPTED').length;


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
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

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'properties', label: 'Properties' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'profile', label: 'Profile' }
  ];

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
                <h2>Dashboard Overview</h2>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div 
                  className="card bg-primary text-white" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveTab('properties')}
                >
                  <div className="card-body">
                    <h5 className="card-title">Total Properties</h5>
                    <h3>{totalProperties}</h3>
                    <small>Click to manage properties</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div 
                  className="card bg-warning text-white" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveTab('bookings')}
                >
                  <div className="card-body">
                    <h5 className="card-title">Pending Requests</h5>
                    <h3>{pendingBookings}</h3>
                    <small>Click to review requests</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div 
                  className="card bg-success text-white" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveTab('bookings')}
                >
                  <div className="card-body">
                    <h5 className="card-title">Accepted Bookings</h5>
                    <h3>{acceptedBookings}</h3>
                    <small>Click to view confirmed bookings</small>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'properties':
        return (
          <>
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2>My Properties</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowPropertyForm(!showPropertyForm)}
                  >
                    {showPropertyForm ? 'Cancel' : 'Add New Property'}
                  </button>
                </div>
                
                {showPropertyForm ? (
                  <PropertyForm onPropertyCreated={handlePropertyCreated} />
                ) : (
                  <PropertyList 
                    properties={properties} 
                    onPropertyUpdated={loadAllData}
                  />
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
                <h2>Booking Requests</h2>
                
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
                    {statusFilter === 'all' ? 'No booking requests' : `No ${statusFilter} bookings`}
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Guest</th>
                          <th>Dates</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredBookings().map(booking => (
                          <tr key={booking.id}>
                            <td>
                              <strong>{booking.property?.name || 'Unknown Property'}</strong>
                            </td>
                            <td>
                              {booking.traveler?.name || 'Unknown Guest'}
                              <br />
                              <small className="text-muted">{booking.traveler?.email}</small>
                            </td>
                            <td>
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </td>
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
                            <td>
                              {booking.status === 'PENDING' && (
                                <>
                                  <button 
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleAcceptBooking(booking.id)}
                                  >
                                    Accept
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {booking.status === 'ACCEPTED' && (
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Cancel
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
                      userType="owner"
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

export default OwnerDashboard;

