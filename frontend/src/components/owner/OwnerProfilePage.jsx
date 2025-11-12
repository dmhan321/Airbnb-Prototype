import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUser } from '../../store/slices/authSlice';
import AirbnbHeader from '../common/AirbnbHeader';
import ModernProfileView from '../common/ModernProfileView';
import ProfileEditForm from '../common/ProfileEditForm';
import '../common/ProfilePage.css';
import './OwnerProfilePage.css';

const OwnerProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user);

  useEffect(() => {
    // Only update profileData when user changes
    // Don't redirect here - render guard handles authentication
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedUser) => {
    // ProfileEditForm already called the API, just update Redux state
    // Ensure userType is preserved if missing
    if (updatedUser && !updatedUser.userType && user?.userType) {
      updatedUser.userType = user.userType;
    }
    dispatch(setUser(updatedUser));
    // Also update localStorage to keep it in sync
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setProfileData(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData(user); // Reset to original user data
  };

  // Only show loading/null if truly not authenticated (no token)
  // Don't hide content during profile updates when user might be temporarily null
  const token = localStorage.getItem('token');
  if (!token) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="owner-profile-page profile-page">
      <AirbnbHeader />
      
      <div className="profile-container">
        <h1 className="profile-title">Profile</h1>
        
        {isEditing ? (
          <div className="profile-edit-section">
            <ProfileEditForm
              user={profileData}
              onSave={handleSave}
              onCancel={handleCancel}
              userType="owner"
            />
          </div>
        ) : (
          <div className="profile-view-section">
            <ModernProfileView
              user={profileData}
              onEdit={handleEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerProfilePage;

