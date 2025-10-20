import React, { useState, useEffect } from 'react';
import { propertyService } from '../../services/propertyService';

const PropertyEditForm = ({ property, onPropertyUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'apartment',
    description: '',
    location: '',
    city: '',
    country: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: '',
    availableFrom: '',
    availableTo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || '',
        type: property.type || 'apartment',
        description: property.description || '',
        location: property.location || '',
        city: property.city || '',
        country: property.country || '',
        price: property.price || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        maxGuests: property.maxGuests || '',
        amenities: property.amenities || '',
        availableFrom: property.availableFrom ? property.availableFrom.split('T')[0] : '',
        availableTo: property.availableTo ? property.availableTo.split('T')[0] : ''
      });
      setPhotoPreviews(property.images || []);
    }
  }, [property]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews([...photoPreviews, ...previews]);
  };

  const removePhoto = (index) => {
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
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

      // Convert string values to appropriate types
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        maxGuests: parseInt(formData.maxGuests) || 1
      };

      const response = await propertyService.updateProperty(property.id, propertyData);
      if (response.success) {
        // Upload new photos if any
        if (photos.length > 0) {
          try {
            await propertyService.uploadPropertyPhotos(property.id, photos);
          } catch (photoError) {
            console.error('Photo upload error:', photoError);
            // Don't fail the entire operation if photos fail
          }
        }
        onPropertyUpdated();
      }
    } catch (err) {
      console.error('Property update error:', err);
      setError(err.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8 mx-auto">
        <div className="card">
          <div className="card-header">
            <h4>Edit Property</h4>
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
                <small className="text-muted">Upload additional photos (JPG, PNG, GIF)</small>
                
                {/* Photo Previews */}
                {photoPreviews.length > 0 && (
                  <div className="mt-3">
                    <h6>Current Photos:</h6>
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
                <div className="col-md-6 mb-3">
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
                <div className="col-md-6 mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
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
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amenities (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    placeholder="WiFi, Pool, Parking, etc."
                  />
                </div>
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

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Property'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyEditForm;


