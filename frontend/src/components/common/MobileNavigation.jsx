import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import './MobileNavigation.css';

const MobileNavigation = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getDashboardPath = () => {
    return user.userType === 'traveler' ? '/traveler' : '/owner';
  };

  const isDashboardActive = () => {
    const path = getDashboardPath();
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const isFavoritesActive = () => {
    return location.search.includes('tab=favorites') || location.pathname.includes('favorites');
  };

  const isProfileActive = () => {
    return location.search.includes('tab=profile') || location.pathname.includes('profile');
  };

  return (
    <nav className="mobile-navigation">
      <Link
        to="/"
        className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span>Home</span>
      </Link>
      
      <Link
        to={getDashboardPath()}
        className={`mobile-nav-item ${isDashboardActive() && !isFavoritesActive() && !isProfileActive() ? 'active' : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
        <span>Dashboard</span>
      </Link>

      {user.userType === 'traveler' && (
        <button
          onClick={() => {
            const dashboard = getDashboardPath();
            window.location.href = `${dashboard}#favorites`;
            // Trigger tab change in dashboard
            const event = new CustomEvent('dashboardTabChange', { detail: 'favorites' });
            window.dispatchEvent(event);
          }}
          className={`mobile-nav-item ${isFavoritesActive() ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/>
          </svg>
          <span>Favorites</span>
        </button>
      )}

      <button
        onClick={() => {
          const dashboard = getDashboardPath();
          window.location.href = `${dashboard}#profile`;
          // Trigger tab change in dashboard
          const event = new CustomEvent('dashboardTabChange', { detail: 'profile' });
          window.dispatchEvent(event);
        }}
        className={`mobile-nav-item ${isProfileActive() ? 'active' : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <span>Profile</span>
      </button>
    </nav>
  );
};

export default MobileNavigation;

