import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { propertyService } from '../../services/propertyService';
import AirbnbHeader from '../common/AirbnbHeader';
import PropertyForm from './PropertyForm';
import PropertyEditForm from './PropertyEditForm';
import { getImageUrl } from '../../utils/imageUtils';
import './OwnerPropertiesPage.css';

const OwnerPropertiesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(null);
  const isUpdatingRef = useRef(false); // Track if we're in the middle of an update

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    loadProperties();
  }, [isAuthenticated, user, navigate]);

  // Handle edit from navigation state
  useEffect(() => {
    // Don't interfere if we're updating or already editing
    if (isUpdatingRef.current || editingProperty) {
      return;
    }
    
    const editPropertyId = location.state?.editPropertyId;
    if (editPropertyId && properties.length > 0) {
      // Convert both IDs to strings for comparison
      const propertyToEdit = properties.find(p => {
        const propId = String(p.id || p._id);
        const editId = String(editPropertyId);
        return propId === editId;
      });
      if (propertyToEdit) {
        setEditingProperty(propertyToEdit);
        // Clear location state to prevent re-triggering on re-render
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, properties, editingProperty]);

  // Handle create new from navigation state
  useEffect(() => {
    if (location.state?.createNew) {
      setShowPropertyForm(true);
    }
  }, [location.state]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await propertyService.getOwnerProperties();
      setProperties(response.properties || []);
      return Promise.resolve();
    } catch (err) {
      setError('Failed to load properties');
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyCreated = () => {
    setShowPropertyForm(false);
    loadProperties();
  };

  const handleEdit = (property) => {
    // Clear any location state to prevent conflicts
    if (location.state?.editPropertyId) {
      window.history.replaceState({}, document.title);
    }
    setEditingProperty(property);
    setShowPropertyForm(false);
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
  };

  const handlePropertyUpdated = () => {
    // Set flag to prevent useEffect from interfering
    isUpdatingRef.current = true;
    
    // Clear editing state first
    setEditingProperty(null);
    // Clear any location state that might interfere
    if (location.state?.editPropertyId) {
      window.history.replaceState({}, document.title);
    }
    // Then reload properties
    loadProperties().finally(() => {
      // Reset flag after properties are loaded
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    });
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingProperty(propertyId);
      const response = await propertyService.deleteProperty(propertyId);
      if (response.success) {
        alert('Property deleted successfully!');
        loadProperties();
      } else {
        alert(response.message || 'Failed to delete property');
      }
    } catch (err) {
      alert('Failed to delete property');
    } finally {
      setDeletingProperty(null);
    }
  };

  const handleCardClick = (propertyId) => {
    navigate(`/property/${propertyId}`, {
      state: { 
        referrer: 'properties', 
        referrerLabel: 'Your properties',
        referrerPath: '/owner/properties'
      }
    });
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  // Show property form if creating new property
  if (showPropertyForm && !editingProperty) {
    return (
      <div className="owner-properties-page">
        <AirbnbHeader />
        <div className="properties-container">
          <div className="properties-header">
            <h1 className="properties-title">Create New Property</h1>
            <button
              className="properties-back-button"
              onClick={() => setShowPropertyForm(false)}
            >
              ← Back to Properties
            </button>
          </div>
          <PropertyForm onPropertyCreated={handlePropertyCreated} />
        </div>
      </div>
    );
  }

  // Show edit form if editing a property
  if (editingProperty) {
    return (
      <div className="owner-properties-page">
        <AirbnbHeader />
        <div className="properties-container">
          <div className="properties-header">
            <h1 className="properties-title">Edit Property</h1>
            <button
              className="properties-back-button"
              onClick={handleCancelEdit}
            >
              ← Back to Properties
            </button>
          </div>
          <PropertyEditForm
            key={editingProperty?._id || editingProperty?.id || 'edit-form'}
            property={editingProperty}
            onPropertyUpdated={handlePropertyUpdated}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="owner-properties-page">
      <AirbnbHeader />
      
      <div className="properties-container">
        <div className="properties-header">
          <h1 className="properties-title">Your properties</h1>
          <button
            className="properties-create-button"
            onClick={() => setShowPropertyForm(true)}
          >
            <span className="properties-create-icon">➕</span>
            Create new property
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="properties-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading your properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="properties-error">
            <div className="error-icon">⚠️</div>
            <h3>Error loading properties</h3>
            <p>{error}</p>
            <button className="btn-retry" onClick={loadProperties}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <div className="properties-empty-state">
            <div className="empty-icon">🏠</div>
            <h2>You haven't created any properties yet</h2>
            <p>Start by creating your first property to begin hosting guests.</p>
            <button
              className="btn-explore"
              onClick={() => setShowPropertyForm(true)}
            >
              Create your first property
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && properties.length > 0 && (
          <div className="properties-grid">
            {properties.map(property => (
              <div 
                key={property.id || property._id} 
                className="property-card clickable"
                onClick={() => handleCardClick(property.id || property._id)}
              >
                {/* Property Image */}
                <div className="property-card-image-container">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={getImageUrl(property.images[0])}
                      alt={property.name}
                      className="property-card-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="property-card-image-placeholder"
                    style={{ display: property.images && property.images.length > 0 ? 'none' : 'flex' }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  {/* Price Badge */}
                  <div className="property-card-price-badge">
                    <span className="property-card-price-amount">${property.price}</span>
                    <span className="property-card-price-label">/night</span>
                  </div>
                </div>

                {/* Property Content */}
                <div className="property-card-content">
                  <h3 className="property-card-name">{property.name}</h3>
                  <p className="property-card-location">
                    {property.city}{property.state ? `, ${property.state}` : property.country ? `, ${property.country}` : ''}
                  </p>

                  <div className="property-card-details">
                    {property.bedrooms && (
                      <span className="property-card-detail-item">
                        {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="property-card-detail-item">
                        {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                      </span>
                    )}
                    {property.maxGuests && (
                      <span className="property-card-detail-item">
                        Up to {property.maxGuests} guests
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div 
                    className="property-card-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="property-card-action-btn edit"
                      onClick={() => handleEdit(property)}
                    >
                      Edit
                    </button>
                    <button
                      className="property-card-action-btn delete"
                      onClick={() => handleDelete(property.id || property._id)}
                      disabled={deletingProperty === (property.id || property._id)}
                    >
                      {deletingProperty === (property.id || property._id) ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPropertiesPage;

