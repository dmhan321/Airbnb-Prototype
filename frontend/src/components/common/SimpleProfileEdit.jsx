import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { getImageUrl } from '../../utils/imageUtils';

const SimpleProfileEdit = ({ user, onSave, onCancel, userType = 'traveler' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    aboutMe: '',
    languages: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(getImageUrl(user?.profilePicture));

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        aboutMe: user.aboutMe || '',
        languages: user.languages || '',
        gender: user.gender || ''
      });
      // Get full URL for existing profile pictures
      setProfilePicturePreview(getImageUrl(user.profilePicture));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // If there's a new profile picture, upload it first
      let profilePictureUrl = user.profilePicture;
      if (profilePicture) {
        const uploadResponse = await authService.uploadProfilePicture(profilePicture, userType);
        if (uploadResponse.success) {
          profilePictureUrl = uploadResponse.profilePicture;
        }
      }

      // Update profile with new data including picture URL
      const updateData = {
        ...formData,
        profilePicture: profilePictureUrl
      };

      const response = await authService.updateProfile(updateData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        // Call onSave with updated user data
        onSave(response.user);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain',
    'Australia', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'South Africa',
    'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Turkey', 'Russia', 'Ukraine', 'Poland',
    'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark',
    'Finland', 'Ireland', 'Portugal', 'Greece', 'Croatia', 'Czech Republic', 'Hungary',
    'Romania', 'Bulgaria', 'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania'
  ];

  const states = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }, { value: 'DC', label: 'District of Columbia' }
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Edit Profile</h3>
          <button className="btn btn-outline-secondary" onClick={onCancel}>
            <i className="fas fa-times me-2"></i>Cancel
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="row mb-4">
            <div className="col-12">
              <label className="form-label">Profile Picture</label>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {profilePicturePreview ? (
                    <img 
                      src={profilePicturePreview} 
                      alt="Profile Preview" 
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                      style={{ width: '80px', height: '80px' }}
                    >
                      <span className="text-muted">👤</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handlePictureChange}
                    style={{ maxWidth: '300px' }}
                  />
                  <small className="text-muted">Upload a profile picture (JPG, PNG, GIF)</small>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Name *</label>
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
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Languages</label>
              <input
                type="text"
                className="form-control"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="English, Spanish, French..."
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Address</label>
              <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, apartment number, etc."
                rows="2"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
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
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.value} value={state.value}>{state.value}</option>
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

          <div className="mb-3">
            <label className="form-label">About Me</label>
            <textarea
              className="form-control"
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleChange}
              rows="3"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleProfileEdit;
