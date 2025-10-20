import React from 'react';

const SimpleProfileView = ({ user, onEdit }) => {
  if (!user) {
    return <div className="alert alert-info">Loading profile...</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Your Profile</h3>
          <button className="btn btn-primary" onClick={onEdit}>
            <i className="fas fa-edit me-2"></i>Edit Profile
          </button>
        </div>

        <div className="row">
          {/* Profile Picture */}
          <div className="col-md-3 text-center mb-4">
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
          </div>

          {/* Profile Information */}
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Name:</strong>
                <p className="text-muted">{user.name || 'Not provided'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Email:</strong>
                <p className="text-muted">{user.email || 'Not provided'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Phone:</strong>
                <p className="text-muted">{user.phone || 'Not provided'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Gender:</strong>
                <p className="text-muted">{user.gender || 'Not specified'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Languages:</strong>
                <p className="text-muted">{user.languages || 'Not provided'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Address:</strong>
                <p className="text-muted">{user.address || 'Not provided'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>City:</strong>
                <p className="text-muted">{user.city || 'Not provided'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>State:</strong>
                <p className="text-muted">{user.state || 'Not provided'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Country:</strong>
                <p className="text-muted">{user.country || 'Not provided'}</p>
              </div>
            </div>

            {/* About Me */}
            {user.aboutMe && (
              <div className="mb-3">
                <strong>About Me:</strong>
                <p className="text-muted">{user.aboutMe}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileView;
