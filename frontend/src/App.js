import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import HomePage from './components/common/HomePage';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import TravelerDashboard from './components/traveler/TravelerDashboard';
import PropertyDetails from './components/traveler/PropertyDetails';
import OwnerDashboard from './components/owner/OwnerDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import AgentButton from './components/agent/AgentButton';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/traveler" element={<ProtectedRoute requiredUserType="traveler"><TravelerDashboard /></ProtectedRoute>} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/owner" element={<ProtectedRoute requiredUserType="owner"><OwnerDashboard /></ProtectedRoute>} />
          </Routes>
          <AgentButton />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
