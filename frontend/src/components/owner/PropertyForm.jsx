import React, { useState } from 'react';
import { propertyService } from '../../services/propertyService';
import './PropertyForm.css';

const PropertyForm = ({ onPropertyCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'apartment',
    description: '',
    location: '',
    city: '',
    state: '',
    country: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: '',
    availableFrom: '',
    availableTo: ''
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // US State abbreviations only
  const usStates = [
    { value: '', label: 'Select State' },
    { value: 'AL', label: 'AL' }, { value: 'AK', label: 'AK' }, { value: 'AZ', label: 'AZ' },
    { value: 'AR', label: 'AR' }, { value: 'CA', label: 'CA' }, { value: 'CO', label: 'CO' },
    { value: 'CT', label: 'CT' }, { value: 'DE', label: 'DE' }, { value: 'FL', label: 'FL' },
    { value: 'GA', label: 'GA' }, { value: 'HI', label: 'HI' }, { value: 'ID', label: 'ID' },
    { value: 'IL', label: 'IL' }, { value: 'IN', label: 'IN' }, { value: 'IA', label: 'IA' },
    { value: 'KS', label: 'KS' }, { value: 'KY', label: 'KY' }, { value: 'LA', label: 'LA' },
    { value: 'ME', label: 'ME' }, { value: 'MD', label: 'MD' }, { value: 'MA', label: 'MA' },
    { value: 'MI', label: 'MI' }, { value: 'MN', label: 'MN' }, { value: 'MS', label: 'MS' },
    { value: 'MO', label: 'MO' }, { value: 'MT', label: 'MT' }, { value: 'NE', label: 'NE' },
    { value: 'NV', label: 'NV' }, { value: 'NH', label: 'NH' }, { value: 'NJ', label: 'NJ' },
    { value: 'NM', label: 'NM' }, { value: 'NY', label: 'NY' }, { value: 'NC', label: 'NC' },
    { value: 'ND', label: 'ND' }, { value: 'OH', label: 'OH' }, { value: 'OK', label: 'OK' },
    { value: 'OR', label: 'OR' }, { value: 'PA', label: 'PA' }, { value: 'RI', label: 'RI' },
    { value: 'SC', label: 'SC' }, { value: 'SD', label: 'SD' }, { value: 'TN', label: 'TN' },
    { value: 'TX', label: 'TX' }, { value: 'UT', label: 'UT' }, { value: 'VT', label: 'VT' },
    { value: 'VA', label: 'VA' }, { value: 'WA', label: 'WA' }, { value: 'WV', label: 'WV' },
    { value: 'WI', label: 'WI' }, { value: 'WY', label: 'WY' }
  ];

  // Common amenities
  const availableAmenities = [
    'WiFi', 'Air Conditioning', 'Heating', 'Kitchen', 'Washer', 'Dryer', 
    'Parking', 'Pool', 'Hot Tub', 'Gym', 'TV', 'Workspace', 
    'Fireplace', 'Balcony', 'Garden', 'Pet Friendly', 'Smoking Allowed',
    'Wheelchair Accessible', 'Elevator', 'Security System'
  ];

  // Countries list
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain',
    'Australia', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'South Africa',
    'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Turkey', 'Russia', 'Ukraine', 'Poland',
    'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark',
    'Finland', 'Ireland', 'Portugal', 'Greece', 'Croatia', 'Czech Republic', 'Hungary',
    'Romania', 'Bulgaria', 'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania'
  ];

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Append new files to existing ones (allow multiple selections)
    setPhotos(prevPhotos => [...prevPhotos, ...files]);
    
    // Create previews for new files and append to existing
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.location || !formData.city || !formData.country) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Convert selected amenities array to comma-separated string
      const amenitiesString = selectedAmenities.join(', ');

      // Helper function to safely parse integers with minimum value
      const safeParseInt = (value, defaultValue = 0, min = 0) => {
        const parsed = parseInt(value);
        if (isNaN(parsed) || parsed < min) {
          return defaultValue;
        }
        return parsed;
      };

      // Helper function to safely parse floats with minimum value
      const safeParseFloat = (value, defaultValue = 0, min = 0) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < min) {
          return defaultValue;
        }
        return parsed;
      };

      // Convert string values to appropriate types
      const propertyData = {
        ...formData,
        amenities: amenitiesString,
        price: safeParseFloat(formData.price, 0, 0),
        bedrooms: safeParseInt(formData.bedrooms, 0, 0),
        bathrooms: safeParseInt(formData.bathrooms, 0, 0),
        maxGuests: safeParseInt(formData.maxGuests, 1, 1)
      };
      
      
      const response = await propertyService.createProperty(propertyData);
      if (response.success) {
        // Upload photos if any
        if (photos.length > 0) {
          try {
            const propertyId = response.property.id || response.property._id;
            await propertyService.uploadPropertyPhotos(propertyId, photos);
          } catch (photoError) {
            // Don't fail the entire operation if photos fail
          }
        }
        onPropertyCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8 mx-auto">
        <div className="card">
          <div className="card-header">
            <h4>Add New Property</h4>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Property Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Property Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="mb-3">
                <label className="form-label">Property Photos</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                />
                <small className="text-muted">
                  Select multiple photos at once (hold Ctrl/Cmd to select multiple). 
                  You can add more photos by selecting again. Maximum 10 photos total. (JPG, PNG, GIF)
                </small>
                
                {/* Photo Previews */}
                {photoPreviews.length > 0 && (
                  <div className="mt-3">
                    <h6>Photo Previews:</h6>
                    <div className="row">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="col-md-3 mb-2">
                          <div className="position-relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="img-thumbnail"
                              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              onClick={() => removePhoto(index)}
                              style={{ transform: 'translate(50%, -50%)' }}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Full address or location"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">State</label>
                  <select
                    className="form-select"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  >
                    {usStates.map(state => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Country</label>
                  <select
                    className="form-select"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Price per Night ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Bedrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Bathrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Guests</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Amenities Section */}
              <div className="mb-3">
                <label className="form-label">Amenities</label>
                <div className="amenities-buttons-container">
                  {availableAmenities.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      className={`amenity-button ${selectedAmenities.includes(amenity) ? 'selected' : ''}`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
                {selectedAmenities.length > 0 && (
                  <small className="text-muted d-block mt-2">
                    Selected: {selectedAmenities.join(', ')}
                  </small>
                )}
              </div>

              {/* Availability Section */}
              <div className="row mb-3">
                <div className="col-12">
                  <h6>Availability</h6>
                  <p className="text-muted">Set the dates when your property is available for booking</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Available From</label>
                  <input
                    type="date"
                    className="form-control"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Available To</label>
                  <input
                    type="date"
                    className="form-control"
                    name="availableTo"
                    value={formData.availableTo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
