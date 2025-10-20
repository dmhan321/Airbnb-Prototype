import React, { useState, useEffect } from 'react';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../traveler/PropertyCard';
import PropertySearch from '../traveler/PropertySearch';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getAllProperties();
      setProperties(response.properties || []);
    } catch (err) {
      setError('Failed to load properties');
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

  return (
    <div className="container mt-4">
      {/* Header with App Name and Navigation */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-0">🏠 Airbnb Prototype</h1>
              <p className="text-muted">Find your perfect stay</p>
            </div>
            <div>
              <a href="/login" className="btn btn-primary me-2">
                Login
              </a>
              <a href="/signup" className="btn btn-outline-primary">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>


      {/* Property Search */}
      <div className="row">
        <div className="col-12">
          <PropertySearch onSearch={handleSearch} />
        </div>
      </div>
      
      {/* Properties Grid */}
      <div className="row mt-4">
        <div className="col-12">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="row">
              {properties.length === 0 ? (
                <div className="col-12">
                  <div className="alert alert-info text-center">
                    <h4>No properties found</h4>
                    <p>Try adjusting your search criteria or browse all available properties.</p>
                    <button 
                      className="btn btn-primary" 
                      onClick={loadProperties}
                    >
                      Show All Properties
                    </button>
                  </div>
                </div>
              ) : (
                properties.map(property => (
                  <div key={property.id} className="col-md-6 col-lg-4 mb-3">
                    <PropertyCard property={property} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login Prompt for Property Details */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info text-center">
            <h5>Want to book a property?</h5>
            <p>Please log in to view property details and make bookings.</p>
            <a href="/login" className="btn btn-primary me-2">
              Login
            </a>
            <a href="/signup" className="btn btn-outline-primary">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
