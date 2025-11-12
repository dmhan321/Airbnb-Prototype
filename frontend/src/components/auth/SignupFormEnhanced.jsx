import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';
import AirbnbHeader from '../common/AirbnbHeader';
import './AuthPages.css';

const SignupFormEnhanced = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'traveler'
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Redirect on successful registration
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.userType === 'traveler') {
        navigate('/traveler');
      } else if (user.userType === 'owner') {
        navigate('/owner');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Real-time validation
    if (name === 'email' && value && !validateEmail(value)) {
      setFieldErrors({ ...fieldErrors, email: 'Please enter a valid email address' });
    } else if (name === 'email' && validateEmail(value)) {
      setFieldErrors({ ...fieldErrors, email: '' });
    } else if (name === 'password' && value && value.length < 6) {
      setFieldErrors({ ...fieldErrors, password: 'Password must be at least 6 characters' });
    } else if (name === 'password' && value.length >= 6) {
      setFieldErrors({ ...fieldErrors, password: '' });
    } else {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setFieldErrors({});
    
    // Validate
    if (!validateEmail(formData.email)) {
      setFieldErrors({ ...fieldErrors, email: 'Please enter a valid email address' });
      return;
    }
    
    if (formData.password.length < 6) {
      setFieldErrors({ ...fieldErrors, password: 'Password must be at least 6 characters' });
      return;
    }
    
    await dispatch(registerUser({
      userData: {
        name: formData.name,
        email: formData.email,
        password: formData.password
      },
      userType: formData.userType
    }));
  };

  return (
    <div className="auth-page">
      <AirbnbHeader />
      <div className="auth-container">
        {/* Left Side - Image/Branding */}
        <div className="auth-left">
          <div className="auth-left-content">
            <h1 className="auth-welcome-title">Join us</h1>
            <p className="auth-welcome-subtitle">Create your account and start exploring</p>
            <div className="auth-image-placeholder">
              <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="50" y="50" width="300" height="300" rx="20"/>
                <circle cx="200" cy="200" r="80"/>
                <path d="M150 200 L200 150 L250 200"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Sign up</h2>
              <p className="auth-form-subtitle">Create your account to get started</p>
            </div>

            {error && (
              <div className="auth-error-message">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label className="auth-label">User Type</label>
                <select
                  className={`auth-input ${fieldErrors.userType ? 'error' : ''}`}
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="traveler">Traveler</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Name</label>
                <input
                  type="text"
                  className={`auth-input ${fieldErrors.name ? 'error' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                {fieldErrors.name && (
                  <span className="auth-field-error">{fieldErrors.name}</span>
                )}
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  className={`auth-input ${fieldErrors.email ? 'error' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                {fieldErrors.email && (
                  <span className="auth-field-error">{fieldErrors.email}</span>
                )}
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  className={`auth-input ${fieldErrors.password ? 'error' : ''}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  minLength="6"
                />
                {fieldErrors.password && (
                  <span className="auth-field-error">{fieldErrors.password}</span>
                )}
                <small className="auth-hint">Password must be at least 6 characters</small>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>

            <div className="auth-form-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupFormEnhanced;



