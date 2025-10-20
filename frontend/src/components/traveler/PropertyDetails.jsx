import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { bookingService } from '../../services/bookingService';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../contexts/AuthContext';
import AvailabilityCalendar from './AvailabilityCalendar';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);

  // Get blocked dates from existing bookings
  const getBlockedDates = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/property/${id}/blocked-dates`);
      const data = await response.json();
      
      if (data.success) {
        setBlockedDates(data.blockedDates);
      } else {
        console.error('Failed to fetch blocked dates:', data.message);
        setBlockedDates([]);
      }
    } catch (err) {
      console.error('Error fetching blocked dates:', err);
      setBlockedDates([]);
    }
  }, [id]);


  const loadProperty = useCallback(async () => {
    try {
      setLoading(true);
      const response = await propertyService.getPropertyById(id);
      if (response.success) {
        setProperty(response.property);
      }
    } catch (err) {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkFavorite = useCallback(async () => {
    try {
      const response = await favoriteService.checkFavorite(id);
      setIsFavorited(response.isFavorited);
    } catch (err) {
      // Ignore error for favorites
    }
  }, [id]);

  useEffect(() => {
    loadProperty();
    if (user) {
      checkFavorite();
      getBlockedDates();
    }
  }, [loadProperty, checkFavorite, getBlockedDates, user]);

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(id);
        setIsFavorited(false);
      } else {
        await favoriteService.addFavorite(id);
        setIsFavorited(true);
      }
    } catch (err) {
      setError('Failed to update favorite');
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');

    try {
      // Check if selected dates are blocked
      const startDate = bookingData.startDate;
      const endDate = bookingData.endDate;
      
      // Check if any date in the range is blocked
      const isDateRangeBlocked = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          if (blockedDates.includes(dateString)) {
            return true;
          }
        }
        return false;
      };

      if (isDateRangeBlocked()) {
        setError('Selected dates are not available. Please choose different dates.');
        setBookingLoading(false);
        return;
      }

      const response = await bookingService.createBooking({
        propertyId: parseInt(id),
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        guests: parseInt(bookingData.guests)
      });

      if (response.success) {
        alert('Booking request created successfully!');
        navigate('/traveler');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
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

  if (error || !property) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error || 'Property not found'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>🏠 Airbnb Prototype - Property Details</h2>
              <p className="text-muted mb-0">{property.name}</p>
            </div>
            <div>
              {user && (
                <a href="/traveler" className="btn btn-outline-primary">
                  🔍 Back to Search
                </a>
              )}
              {!user && (
                <a href="/" className="btn btn-outline-primary">
                  🔍 Back to Search
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            {/* Property Photos */}
            {property.images && property.images.length > 0 && (
              <div className="card-img-top">
                <div id="propertyCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {property.images.map((image, index) => (
                      <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                          src={image}
                          alt={`${property.name} ${index + 1}`}
                          className="d-block w-100"
                          style={{ height: '400px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {property.images.length > 1 && (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2>{property.name}</h2>
                {user ? (
                  <button
                    className={`btn ${isFavorited ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={handleFavorite}
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
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
              
              <p className="text-muted">
                <strong>Type:</strong> {property.type} | 
                <strong> Location:</strong> {property.city}, {property.country}
              </p>
              
              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Price:</strong> ${property.price}/night
                </div>
                <div className="col-md-3">
                  <strong>Bedrooms:</strong> {property.bedrooms}
                </div>
                <div className="col-md-3">
                  <strong>Bathrooms:</strong> {property.bathrooms}
                </div>
                <div className="col-md-3">
                  <strong>Max Guests:</strong> {property.maxGuests}
                </div>
              </div>


              {property.description && (
                <div className="mb-3">
                  <h5>Description</h5>
                  <p>{property.description}</p>
                </div>
              )}

              {property.amenities && (
                <div className="mb-3">
                  <h5>Amenities</h5>
                  <p>{property.amenities}</p>
                </div>
              )}

              {property.owner && (
                <div className="mb-3">
                  <h5>Hosted by</h5>
                  <p>{property.owner.name} - {property.owner.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {user ? (
            <div className="card">
              <div className="card-header">
                <h5>Book this property</h5>
              </div>
              <div className="card-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              
              {/* Availability Calendar */}
              <AvailabilityCalendar
                blockedDates={blockedDates}
                onDateSelect={(dates) => {
                  setBookingData({
                    ...bookingData,
                    startDate: dates.startDate,
                    endDate: dates.endDate
                  });
                }}
                selectedStartDate={bookingData.startDate}
                selectedEndDate={bookingData.endDate}
                minDate={property.availableFrom || new Date().toISOString().split('T')[0]}
                maxDate={property.availableTo}
              />
              
              <form onSubmit={handleBookingSubmit}>
                
                <div className="mb-3">
                  <label className="form-label">Number of Guests</label>
                  <input
                    type="number"
                    className="form-control"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleBookingChange}
                    required
                    min="1"
                    max={property.maxGuests}
                  />
                  <small className="text-muted">
                    Maximum: {property.maxGuests} guests
                  </small>
                </div>
                
                {/* Booking Summary */}
                {bookingData.startDate && bookingData.endDate && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6>Booking Summary</h6>
                    <div className="row">
                      <div className="col-6">
                        <small>
                          <strong>Check-in:</strong><br/>
                          {new Date(bookingData.startDate).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="col-6">
                        <small>
                          <strong>Check-out:</strong><br/>
                          {new Date(bookingData.endDate).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-6">
                        <small>
                          <strong>Guests:</strong> {bookingData.guests}
                        </small>
                      </div>
                      <div className="col-6">
                        <small>
                          <strong>Nights:</strong> {Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))}
                        </small>
                      </div>
                    </div>
                    <hr className="my-2"/>
                    <div className="d-flex justify-content-between">
                      <strong>Total:</strong>
                      <strong>${(property.price * Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))).toFixed(2)}</strong>
                    </div>
                  </div>
                )}
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={bookingLoading}
                    title="Submit your booking request"
                  >
                    {bookingLoading ? 'Creating Booking...' : 'Request Booking'}
                  </button>
                </div>
              </form>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h5>Book this property</h5>
              </div>
              <div className="card-body text-center">
                <div className="alert alert-info">
                  <h6>Login Required</h6>
                  <p>Please log in to book this property.</p>
                  <a href="/login" className="btn btn-primary me-2">
                    Login
                  </a>
                  <a href="/signup" className="btn btn-outline-primary">
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
