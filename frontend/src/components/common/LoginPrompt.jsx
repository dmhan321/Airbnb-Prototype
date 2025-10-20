import React from 'react';
import { Link } from 'react-router-dom';

const LoginPrompt = ({ message = "Please log in to access this feature" }) => {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>🏠 Airbnb Prototype</h2>
            <Link to="/" className="btn btn-outline-primary">
              🏠 Home
            </Link>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <h4 className="card-title">Authentication Required</h4>
              <p className="card-text">{message}</p>
              <div className="d-grid gap-2">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline-secondary">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;


