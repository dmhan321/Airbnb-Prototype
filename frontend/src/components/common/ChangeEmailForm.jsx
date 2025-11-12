import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';

const ChangeEmailForm = ({ user, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newEmail: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.newEmail || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.newEmail)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.newEmail.toLowerCase() === user?.email?.toLowerCase()) {
      setError('New email must be different from current email');
      setLoading(false);
      return;
    }

    try {
      // Update profile with new email and password for verification
      const response = await authService.updateProfile({
        email: formData.newEmail,
        password: formData.password
      });

      if (response.success) {
        setSuccess('Email changed successfully! You will be logged out and redirected to login page.');
        // Reset form
        setFormData({
          newEmail: '',
          password: ''
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Logout and redirect to login after a short delay
        setTimeout(async () => {
          await dispatch(logoutUser());
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setError(response.message || 'Failed to change email');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Change Email</h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        {success && (
          <div className="alert alert-success">{success}</div>
        )}
        
        <div className="mb-3">
          <label className="form-label">Current Email</label>
          <input
            type="email"
            className="form-control"
            value={user?.email || ''}
            disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
          <small className="text-muted">Your current email address (cannot be changed here)</small>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Email *</label>
            <input
              type="email"
              className="form-control"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              required
              placeholder="Enter your new email address"
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password (for verification) *</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password to confirm email change"
              autoComplete="current-password"
            />
            <small className="text-muted">Password is required to change your email address for security purposes</small>
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Changing Email...' : 'Change Email'}
            </button>
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmailForm;

