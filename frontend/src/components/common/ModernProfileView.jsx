import React from 'react';
import { getImageUrl } from '../../utils/imageUtils';
import './ModernProfileView.css';

const ModernProfileView = ({ user, onEdit }) => {
  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  // Format location string
  const formatLocation = () => {
    const parts = [];
    if (user.city) parts.push(user.city);
    if (user.state) parts.push(user.state);
    if (user.country) parts.push(user.country);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const location = formatLocation();

  return (
    <div className="modern-profile-view">
      {/* Profile Header - Centered */}
      <div className="profile-header">
        <div className="profile-picture-wrapper">
          {user.profilePicture ? (
            <>
              <img 
                src={getImageUrl(user.profilePicture)} 
                alt="Profile" 
                className="profile-picture"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.nextElementSibling;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div className="profile-picture-placeholder" style={{ display: 'none' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </>
          ) : (
            <div className="profile-picture-placeholder">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          )}
        </div>
        <h2 className="profile-name">{user.name || 'Your Name'}</h2>
        <p className="profile-email">{user.email || 'your.email@example.com'}</p>
        <button className="btn-edit-profile" onClick={onEdit}>
          Edit Profile
        </button>
      </div>

      {/* Information Card - Single Container */}
      <div className="profile-info-card">
        <h3 className="section-title">Personal Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{user.name || 'Not provided'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email || 'Not provided'}</span>
          </div>
          
          {user.phone && (
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{user.phone}</span>
            </div>
          )}
          
          {location && (
            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value">{location}</span>
            </div>
          )}
          
          {user.gender && (
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">{user.gender}</span>
            </div>
          )}
          
          {user.languages && (
            <div className="info-item">
              <span className="info-label">Languages</span>
              <span className="info-value">{user.languages}</span>
            </div>
          )}
        </div>
      </div>

      {/* About Me Section */}
      {user.aboutMe && (
        <div className="profile-about-card">
          <h3 className="section-title">About Me</h3>
          <p className="about-text">{user.aboutMe}</p>
        </div>
      )}
    </div>
  );
};

export default ModernProfileView;

