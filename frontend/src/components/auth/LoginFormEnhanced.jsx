import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import AirbnbHeader from '../common/AirbnbHeader';
import './AuthPages.css';

const LoginFormEnhanced = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'traveler'
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Redirect on successful login
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
      setFieldErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    await dispatch(loginUser({
      email: formData.email,
      password: formData.password,
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
            <h1 className="auth-welcome-title">Welcome back</h1>
            <p className="auth-welcome-subtitle">Sign in to continue your journey</p>
            <div className="auth-image-placeholder">
              <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="50" y="50" width="300" height="300" rx="20"/>
                <path d="M150 200 L200 250 L250 150"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Log in</h2>
              <p className="auth-form-subtitle">Enter your credentials to access your account</p>
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
                />
                {fieldErrors.password && (
                  <span className="auth-field-error">{fieldErrors.password}</span>
                )}
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <div className="auth-form-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormEnhanced;



