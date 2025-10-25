import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// NEW: Import agent floating styles
import './components/agent/AgentStyles.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomePage from './components/common/HomePage';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import TravelerDashboard from './components/traveler/TravelerDashboard';
import PropertyDetails from './components/traveler/PropertyDetails';
import OwnerDashboard from './components/owner/OwnerDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

// Floating AI Agent
import AgentButton from './components/agent/AgentButton';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          {/* Your app pages */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/traveler"
              element={
                <ProtectedRoute requiredUserType="traveler">
                  <TravelerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route
              path="/owner"
              element={
                <ProtectedRoute requiredUserType="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Floating AI Concierge Agent — available on all pages */}
          <AgentButton />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;