import React, { useState } from 'react';
import { propertyService } from '../../services/propertyService';
import PropertyEditForm from './PropertyEditForm';

const PropertyList = ({ properties, loading, error, onPropertyUpdated }) => {
  const [editingProperty, setEditingProperty] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(null);

  const handleEdit = (property) => {
    setEditingProperty(property);
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        setDeletingProperty(propertyId);
        const response = await propertyService.deleteProperty(propertyId);
        if (response.success) {
          alert('Property deleted successfully!');
          onPropertyUpdated();
        } else {
          alert(response.message || 'Failed to delete property');
        }
      } catch (err) {
        console.error('Delete property error:', err);
        alert('Failed to delete property');
      } finally {
        setDeletingProperty(null);
      }
    }
  };

  const handlePropertyUpdated = () => {
    setEditingProperty(null);
    onPropertyUpdated();
  };

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
    return (
      <div className="alert alert-danger">{error}</div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="alert alert-info">
        No properties found. Add your first property to get started!
      </div>
    );
  }

  // Show edit form if editing a property
  if (editingProperty) {
    return (
      <PropertyEditForm
        property={editingProperty}
        onPropertyUpdated={handlePropertyUpdated}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="row">
      {properties.map(property => (
        <div key={property.id} className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            {/* Property Photo */}
            {property.images && property.images.length > 0 && (
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
              <h5 className="card-title">{property.name}</h5>
              <p className="card-text">
                <strong>Type:</strong> {property.type}<br/>
                <strong>Location:</strong> {property.city}, {property.country}<br/>
                <strong>Price:</strong> ${property.price}/night<br/>
                <strong>Bedrooms:</strong> {property.bedrooms} | <strong>Bathrooms:</strong> {property.bathrooms}
              </p>
              {property.description && (
                <p className="card-text text-muted">{property.description.substring(0, 100)}...</p>
              )}
              <div className="d-flex justify-content-between">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleEdit(property)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(property.id)}
                  disabled={deletingProperty === property.id}
                >
                  {deletingProperty === property.id ? (
                    <span className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                  ) : (
                    '🗑️ Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
