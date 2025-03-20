import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
        try {
          const res = await axios.get('/api/users/profile');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setError(err.response?.data?.msg || 'Authentication error');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Set auth token in headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/users/register', formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      // Load user data
      const userRes = await axios.get('/api/users/profile');
      setUser(userRes.data);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      // Load user data
      const userRes = await axios.get('/api/users/profile');
      setUser(userRes.data);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('/api/users/profile', formData);
      setUser(res.data);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Profile update failed');
      return false;
    }
  };

  // Add child to profile
  const addChild = async (childData) => {
    try {
      const res = await axios.post('/api/users/child', childData);
      setUser(res.data);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add child');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        addChild
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
