import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import AirbnbHeader from '../common/AirbnbHeader';
import ChangeEmailForm from '../common/ChangeEmailForm';
import ChangePasswordForm from '../common/ChangePasswordForm';
import './OwnerAccountSettingsPage.css';

const OwnerAccountSettingsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="owner-account-settings-page">
      <AirbnbHeader />
      
      <div className="account-settings-container">
        <h1 className="account-settings-title">Account Settings</h1>
        
        <div className="account-settings-sections">
          {/* Change Email Section */}
          <div className="account-settings-section">
            <ChangeEmailForm
              user={user}
            />
          </div>

          {/* Change Password Section */}
          <div className="account-settings-section">
            <ChangePasswordForm userType={user?.userType || 'owner'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerAccountSettingsPage;

