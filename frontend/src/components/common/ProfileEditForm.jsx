import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { getImageUrl } from '../../utils/imageUtils';

const ProfileEditForm = ({ user, onSave, onCancel, userType = 'traveler' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
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
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        aboutMe: user.aboutMe || '',
        languages: user.languages || '',
        gender: user.gender || ''
      });
      setProfilePicturePreview(getImageUrl(user.profilePicture));
      setPhotoRemoved(false);
      setHasChanges(false);
    }
  }, [user]);

  // Track changes
  useEffect(() => {
    if (user) {
      const hasFormChanges = 
        formData.name !== (user.name || '') ||
        formData.phone !== (user.phone || '') ||
        formData.city !== (user.city || '') ||
        formData.state !== (user.state || '') ||
        formData.country !== (user.country || '') ||
        formData.aboutMe !== (user.aboutMe || '') ||
        formData.languages !== (user.languages || '') ||
        formData.gender !== (user.gender || '') ||
        profilePicture !== null ||
        photoRemoved;
      setHasChanges(hasFormChanges);
    }
  }, [formData, profilePicture, photoRemoved, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setProfilePicture(file);
      setPhotoRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setProfilePicture(file);
      setPhotoRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemovePhoto = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setPhotoRemoved(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || formData.name.trim() === '') {
      setError('Name is required');
      setLoading(false);
      return;
    }

    try {
      // Upload profile picture if changed
      let profilePictureUrl = user.profilePicture;
      if (profilePicture) {
        try {
          const uploadResponse = await authService.uploadProfilePicture(profilePicture, userType);
          if (uploadResponse.success) {
            profilePictureUrl = uploadResponse.url || uploadResponse.profilePicture;
          } else {
            throw new Error(uploadResponse.message || 'Failed to upload profile picture');
          }
        } catch (uploadError) {
          // Handle 401 specifically - session expired
          if (uploadError.response?.status === 401) {
            setError('Your session has expired. Please refresh the page and try again, or log in again if needed.');
            setLoading(false);
            return; // Don't continue with update
          }
          // Handle other upload errors
          throw uploadError;
        }
      } else if (photoRemoved) {
        // If photo was removed, set to null
        profilePictureUrl = null;
      }

      // Update profile with new data (without email)
      const updateData = {
        name: formData.name,
        phone: formData.phone || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || undefined,
        aboutMe: formData.aboutMe || undefined,
        languages: formData.languages || undefined,
        gender: formData.gender || undefined
      };
      
      // Only include profilePicture if it was changed (uploaded or removed)
      if (profilePicture || photoRemoved) {
        updateData.profilePicture = profilePictureUrl;
      }

      const response = await authService.updateProfile(updateData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setHasChanges(false);
        setTimeout(() => {
          onSave(response.user);
        }, 1000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      // Handle 401 specifically - session expired
      if (err.response?.status === 401) {
        setError('Your session has expired. Please refresh the page and try again, or log in again if needed.');
      } else {
        // Handle other errors
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
        setError(errorMessage);
      }
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

  // US State abbreviations only
  const states = [
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

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger">
          {error}
          {error.includes('session has expired') && (
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary me-2"
                onClick={handleRefreshPage}
              >
                Refresh Page
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      )}
      {success && (
        <div className="alert alert-success">{success}</div>
      )}

      {/* Profile Picture Upload */}
      <div className="mb-4">
        <label className="form-label d-block">Profile Picture</label>
        <div
          className={`border rounded p-4 text-center ${isDragging ? 'border-primary bg-light' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ cursor: 'pointer', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          {profilePicturePreview ? (
            <div className="position-relative">
              <img
                src={profilePicturePreview}
                alt="Profile preview"
                className="rounded-circle mb-2"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute"
                style={{ top: '0', right: '0' }}
                onClick={handleRemovePhoto}
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-2"></i>
              <p className="text-muted">Drag and drop an image here, or click to select</p>
            </div>
          )}
          <input
            type="file"
            className="d-none"
            id="profilePicture"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <label htmlFor="profilePicture" className="btn btn-outline-primary mt-2">
            Select Image
          </label>
        </div>
      </div>

      {/* Personal Information */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            <i className="fas fa-user me-2 text-muted"></i>
            Name *
          </label>
          <input
            type="text"
            className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {fieldErrors.name && (
            <div className="invalid-feedback">{fieldErrors.name}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">
            <i className="fas fa-mobile-alt me-2 text-muted"></i>
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">
            <i className="fas fa-city me-2 text-muted"></i>
            City
          </label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">
            <i className="fas fa-map me-2 text-muted"></i>
            State
          </label>
          <select
            className="form-control"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.value} value={state.value}>{state.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">
            <i className="fas fa-globe me-2 text-muted"></i>
            Country
          </label>
          <select
            className="form-control"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">
            <i className="fas fa-venus-mars me-2 text-muted"></i>
            Gender
          </label>
          <select
            className="form-control"
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
          <label className="form-label">
            <i className="fas fa-language me-2 text-muted"></i>
            Languages
          </label>
          <input
            type="text"
            className="form-control"
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            placeholder="e.g., English, Spanish, French"
          />
        </div>

        <div className="col-12 mb-3">
          <label className="form-label">
            <i className="fas fa-file-alt me-2 text-muted"></i>
            About Me
          </label>
          <textarea
            className="form-control"
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !hasChanges}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;

