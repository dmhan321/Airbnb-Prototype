import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../contexts/AuthContext';

const PropertyCard = ({ property, onFavoriteChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);



  const checkFavorite = useCallback(async () => {
    try {
      const response = await favoriteService.checkFavorite(property.id);
      setIsFavorited(response.isFavorited);
    } catch (err) {
      // Ignore error for favorites
    }
  }, [property.id]);

  useEffect(() => {
    if (user) {
      checkFavorite();
    }
  }, [checkFavorite, user]);

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    setLoading(true);
    
    try {
      if (isFavorited) {
        const response = await favoriteService.removeFavorite(property.id);
        if (response.success) {
          setIsFavorited(false);
          // Notify parent component that favorite was removed
          if (onFavoriteChange) {
            onFavoriteChange(property.id, false);
          }
        } else {
          throw new Error(response.message || 'Failed to remove favorite');
        }
      } else {
        const response = await favoriteService.addFavorite(property.id);
        if (response.success) {
          setIsFavorited(true);
          // Notify parent component that favorite was added
          if (onFavoriteChange) {
            onFavoriteChange(property.id, true);
          }
        } else {
          throw new Error(response.message || 'Failed to add favorite');
        }
      }
    } catch (err) {
      console.error('Favorite error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update favorite';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="d-flex justify-content-between align-items-center">
          <button 
            className="btn btn-outline-primary"
            onClick={handleViewDetails}
            title="View property details, photos, and amenities"
          >
            View Details
          </button>
          {user ? (
            <button 
              className={`btn ${isFavorited ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={handleFavorite}
              disabled={loading}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </span>
              ) : (
                isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'
              )}
            </button>
          ) : (
            <div 
              className="btn btn-outline-secondary"
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
              title="Login to add favorites"
            >
              🤍 Add to Favorites
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
