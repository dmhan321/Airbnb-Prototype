import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Airbnb Theme Styles
import './styles/airbnb-theme.css';
import './styles/animations.css';

// NEW: Import agent floating styles
import './components/agent/AgentStyles.css';
// Import modern profile styles
import './components/common/ProfileStyles.css';

// Redux Store
import { store } from './store/store';
import { checkAuthStatus } from './store/slices/authSlice';

// Pages
import TravelerDashboardEnhanced from './components/traveler/TravelerDashboardEnhanced';
import TravelerFavoritesPage from './components/traveler/TravelerFavoritesPage';
import TravelerTripsPage from './components/traveler/TravelerTripsPage';
import TravelerProfilePage from './components/traveler/TravelerProfilePage';
import TravelerAccountSettingsPage from './components/traveler/TravelerAccountSettingsPage';
import SearchResultsPage from './components/common/SearchResultsPage';
import LoginFormEnhanced from './components/auth/LoginFormEnhanced';
import SignupFormEnhanced from './components/auth/SignupFormEnhanced';
import PropertyDetailsEnhanced from './components/traveler/PropertyDetailsEnhanced';
import OwnerDashboard from './components/owner/OwnerDashboard';
import OwnerPropertiesPage from './components/owner/OwnerPropertiesPage';
import OwnerBookingsPage from './components/owner/OwnerBookingsPage';
import OwnerProfilePage from './components/owner/OwnerProfilePage';
import OwnerAccountSettingsPage from './components/owner/OwnerAccountSettingsPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Floating AI Agent
import AgentButton from './components/agent/AgentButton';

// Mobile Navigation
import MobileNavigation from './components/common/MobileNavigation';

// Component to initialize auth on app load
const AppInitializer = ({ children }) => {
  useEffect(() => {
    // Check auth status on app load
    store.dispatch(checkAuthStatus());
  }, []);

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer>
          <div className="App">
            {/* Your app pages */}
            <Routes>
              <Route path="/" element={<TravelerDashboardEnhanced />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/login" element={<LoginFormEnhanced />} />
              <Route path="/signup" element={<SignupFormEnhanced />} />
              <Route
                path="/traveler"
                element={
                  <ProtectedRoute requiredUserType="traveler">
                    <TravelerDashboardEnhanced />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/traveler/favorites"
                element={
                  <ProtectedRoute requiredUserType="traveler">
                    <TravelerFavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/traveler/trips"
                element={
                  <ProtectedRoute requiredUserType="traveler">
                    <TravelerTripsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/traveler/profile"
                element={
                  <ProtectedRoute requiredUserType="traveler">
                    <TravelerProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/traveler/account-settings"
                element={
                  <ProtectedRoute requiredUserType="traveler">
                    <TravelerAccountSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/property/:id" element={<PropertyDetailsEnhanced />} />
              <Route
                path="/owner"
                element={
                  <ProtectedRoute requiredUserType="owner">
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/properties"
                element={
                  <ProtectedRoute requiredUserType="owner">
                    <OwnerPropertiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/bookings"
                element={
                  <ProtectedRoute requiredUserType="owner">
                    <OwnerBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/profile"
                element={
                  <ProtectedRoute requiredUserType="owner">
                    <OwnerProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/account-settings"
                element={
                  <ProtectedRoute requiredUserType="owner">
                    <OwnerAccountSettingsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>

            {/* Floating AI Concierge Agent — available on all pages */}
            <AgentButton />
            
            {/* Mobile Bottom Navigation */}
            <MobileNavigation />
          </div>
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;