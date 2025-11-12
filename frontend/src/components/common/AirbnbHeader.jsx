import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import './AirbnbHeader.css';

const AirbnbHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Determine if user is a traveler (check userType or default to traveler if not owner)
  const isTraveler = user?.userType === 'traveler' || (isAuthenticated && user && user?.userType !== 'owner');
  const isOwner = user?.userType === 'owner';
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className="airbnb-header">
      <div className="airbnb-header-container">
        {/* Logo */}
        <Link 
          to={isAuthenticated && isOwner ? '/owner' : '/'} 
          className="airbnb-logo"
        >
          <span className="airbnb-logo-icon">🏠</span>
          <span className="airbnb-logo-text">airbnb</span>
        </Link>

        {/* User Menu - Right */}
        <div className="airbnb-header-user">
          {isAuthenticated && user ? (
            <div className="airbnb-user-menu-container" ref={menuRef}>
              <button
                className="airbnb-user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <svg viewBox="0 0 32 32" fill="currentColor" width="16" height="16" className="me-2">
                  <path d="M16 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 2a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8z"/>
                </svg>
                <svg viewBox="0 0 32 32" fill="currentColor" width="16" height="16">
                  <path d="M16 18l-6-6h12l-6 6z"/>
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="airbnb-user-menu">
                  <div className="airbnb-user-menu-header">
                    <div className="airbnb-user-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="airbnb-user-name">{user?.name || 'User'}</div>
                      <div className="airbnb-user-email">{user?.email || ''}</div>
                    </div>
                  </div>
                  <div className="airbnb-user-menu-divider"></div>
                  {/* Show traveler menu items if user is a traveler */}
                  {isTraveler && (
                    <>
                      <Link 
                        to="/traveler/profile" 
                        className="airbnb-user-menu-item" 
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/traveler/trips" 
                        className="airbnb-user-menu-item" 
                        onClick={() => setShowUserMenu(false)}
                      >
                        Trips
                      </Link>
                      <Link 
                        to="/traveler/favorites" 
                        className="airbnb-user-menu-item" 
                        onClick={() => setShowUserMenu(false)}
                      >
                        Favorites
                      </Link>
                    </>
                  )}
                  {/* Show owner menu items if user is an owner */}
                  {isOwner && (
                    <>
                      <Link 
                        to="/owner/profile" 
                        className="airbnb-user-menu-item" 
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/owner/properties" 
                        className="airbnb-user-menu-item" 
                        onClick={() => setShowUserMenu(false)}
                      >
                        Properties
                      </Link>
                      <Link 
                        to="/owner/bookings" 
                        className="airbnb-user-menu-item" 
                        onClick={() => setShowUserMenu(false)}
                      >
                        Bookings
                      </Link>
                    </>
                  )}
                  <Link 
                    to={isTraveler ? '/traveler/account-settings' : '/owner/account-settings'} 
                    className="airbnb-user-menu-item" 
                    onClick={() => setShowUserMenu(false)}
                  >
                    Account Settings
                  </Link>
                  <div className="airbnb-user-menu-divider"></div>
                  <button className="airbnb-user-menu-item" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="airbnb-header-auth">
              <Link to="/login" className="airbnb-link">Log in</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AirbnbHeader;

