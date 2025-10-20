import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Skip auth check if user was recently updated (within last 5 seconds)
      if (lastUpdate && (Date.now() - lastUpdate) < 5000) {
        console.log('AuthContext: Skipping auth check - user recently updated');
        setLoading(false);
        return;
      }
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 5000)
      );
      
      const response = await Promise.race([
        authService.getProfile(),
        timeoutPromise
      ]);
      
      if (response.success) {
        setUser(response.user);
        setUserType(response.user.userType || 'traveler');
      } else {
        setUser(null);
        setUserType(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, type) => {
    try {
      const response = await authService.login({ email, password, userType: type });
      if (response.success) {
        setUser(response.user);
        setUserType(response.user.userType || 'traveler');
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setUserType(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      setUserType(null);
      return { success: true };
    }
  };

  const updateUser = (updatedUser) => {
    console.log('AuthContext: updateUser called with:', updatedUser);
    setUser(updatedUser);
    setLastUpdate(Date.now());
    console.log('AuthContext: user state updated');
  };

  const value = {
    user,
    loading,
    userType,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
