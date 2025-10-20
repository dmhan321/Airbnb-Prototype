import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'traveler'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password, formData.userType);
      if (result.success) {
        if (formData.userType === 'traveler') {
          navigate('/traveler');
        } else {
          navigate('/owner');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>🏠 Airbnb Prototype</h2>
              <p className="text-muted mb-0">Welcome Back</p>
            </div>
            <a href="/" className="btn btn-outline-primary">
              🏠 Home
            </a>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Login</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">User Type</label>
                  <select
                    className="form-select"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                  >
                    <option value="traveler">Traveler</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
