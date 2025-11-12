import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const userType = user?.userType || null;
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Only redirect if there's no token in localStorage (truly logged out)
  // Don't redirect if user is temporarily null during profile updates
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    if (userType === 'traveler') {
      return <Navigate to="/traveler" replace />;
    } else if (userType === 'owner') {
      return <Navigate to="/owner" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;


