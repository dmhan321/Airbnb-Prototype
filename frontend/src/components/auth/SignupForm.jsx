import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'traveler',
    phone: '',
    location: '',
    city: '',
    country: ''
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
      let response;
      if (formData.userType === 'traveler') {
        response = await authService.registerTraveler({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          city: formData.city,
          country: formData.country
        });
      } else {
        response = await authService.registerOwner({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          location: formData.location,
          phone: formData.phone
        });
      }

      if (response.success) {
        if (formData.userType === 'traveler') {
          navigate('/traveler');
        } else {
          navigate('/owner');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
              <p className="text-muted mb-0">Join Us</p>
            </div>
            <a href="/" className="btn btn-outline-primary">
              🏠 Home
            </a>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Sign Up</h3>
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
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
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
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {formData.userType === 'owner' && (
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                {formData.userType === 'traveler' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <p>Already have an account? <a href="/login">Login</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
