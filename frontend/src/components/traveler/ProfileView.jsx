import React from 'react';

const ProfileView = ({ user, onEdit }) => {
  
  if (!user) {
    return <div className="alert alert-info">Loading profile...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Your Profile</h3>
        <button className="btn btn-primary" onClick={onEdit}>
          <i className="fas fa-edit me-2"></i>Edit Profile
        </button>
      </div>
      
      <div className="row">
        {/* Left Sidebar - Primary Information */}
        <div className="col-lg-4 mb-4">
          <div className="text-center">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="img-fluid rounded-circle mb-3" 
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3 mx-auto"
                style={{ width: '150px', height: '150px' }}
              >
                <i className="fas fa-user fa-3x text-white"></i>
              </div>
            )}
            
            <h4 className="mb-1">{user.name || 'Not provided'}</h4>
            <p className="text-muted mb-3">{user.email || 'Not provided'}</p>
            
            <div className="text-center">
              <div className="mb-2">
                <strong>Phone:</strong><br />
                <span className="text-muted">{user.phone || 'Not provided'}</span>
              </div>
              <div className="mb-2">
                <strong>Gender:</strong><br />
                <span className="text-muted">{user.gender || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Content - Detailed Information */}
        <div className="col-lg-8">
          <div className="row">
            <div className="col-md-6 mb-4">
              <h5 className="text-primary mb-3">
                <i className="fas fa-map-marker-alt me-2"></i>Location
              </h5>
              <div className="mb-2">
                <strong>City:</strong> {user.city || 'Not provided'}
              </div>
              <div className="mb-2">
                <strong>State:</strong> {user.state || 'Not provided'}
              </div>
              <div className="mb-2">
                <strong>Country:</strong> {user.country || 'Not provided'}
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <h5 className="text-primary mb-3">
                <i className="fas fa-language me-2"></i>Preferences
              </h5>
              <div className="mb-2">
                <strong>Languages:</strong><br />
                <span className="text-muted">{user.languages || 'Not specified'}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h5 className="text-primary mb-3">
              <i className="fas fa-user-circle me-2"></i>About Me
            </h5>
            <p className="text-muted">{user.aboutMe || 'Not provided'}</p>
          </div>
          
          {user.address && (
            <div className="mb-4">
              <h5 className="text-primary mb-3">
                <i className="fas fa-home me-2"></i>Address
              </h5>
              <p className="text-muted">{user.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
