import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBookings, setStatusFilter } from '../../store/slices/bookingSlice';
import { propertyService } from '../../services/propertyService';
import AirbnbHeader from '../common/AirbnbHeader';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { bookings } = useAppSelector((state) => state.booking);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([
        dispatch(fetchBookings('owner')),
        loadProperties()
      ]);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const response = await propertyService.getOwnerProperties();
      setProperties(response.properties || []);
    } catch (err) {
      setError('Failed to load properties');
    }
  };

  // Calculate stats
  const totalProperties = properties.length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const acceptedBookings = bookings.filter(b => b.status === 'ACCEPTED').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'ACCEPTED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const handleStatClick = (type) => {
    switch (type) {
      case 'properties':
        navigate('/owner/properties');
        break;
      case 'pending':
        dispatch(setStatusFilter('pending'));
        navigate('/owner/bookings');
        break;
      case 'accepted':
        dispatch(setStatusFilter('accepted'));
        navigate('/owner/bookings');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="owner-dashboard-page">
        <AirbnbHeader />
        <div className="dashboard-loading">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // ProtectedRoute handles this
  }

  return (
    <div className="owner-dashboard-page">
      <AirbnbHeader />
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="dashboard-hero">
          <h1 className="dashboard-hero-title">Welcome back, {user.name}!</h1>
          <p className="dashboard-hero-subtitle">Manage your properties and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats-grid">
          <div 
            className="dashboard-stat-card clickable"
            onClick={() => handleStatClick('properties')}
          >
            <div className="dashboard-stat-icon">🏠</div>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-value">{totalProperties}</div>
              <div className="dashboard-stat-label">Total Properties</div>
            </div>
          </div>

          <div 
            className="dashboard-stat-card clickable"
            onClick={() => handleStatClick('pending')}
          >
            <div className="dashboard-stat-icon">⏳</div>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-value">{pendingBookings}</div>
              <div className="dashboard-stat-label">Pending Bookings</div>
            </div>
          </div>

          <div 
            className="dashboard-stat-card clickable"
            onClick={() => handleStatClick('accepted')}
          >
            <div className="dashboard-stat-icon">✅</div>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-value">{acceptedBookings}</div>
              <div className="dashboard-stat-label">Accepted Bookings</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">💰</div>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-value">${totalRevenue.toLocaleString()}</div>
              <div className="dashboard-stat-label">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-quick-actions">
          <button
            className="dashboard-action-button"
            onClick={() => navigate('/owner/properties', { state: { createNew: true } })}
          >
            <span className="dashboard-action-icon">➕</span>
            <span className="dashboard-action-text">Create New Property</span>
          </button>
          <button
            className="dashboard-action-button secondary"
            onClick={() => navigate('/owner/bookings')}
          >
            <span className="dashboard-action-icon">📅</span>
            <span className="dashboard-action-text">View All Bookings</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
            <button className="btn-airbnb" onClick={loadDashboardData}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
