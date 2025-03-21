import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to register a new user
  async function register(email, password, name) {
    try {
      setError('');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      // Store the token in localStorage
      localStorage.setItem('authToken', data.token);
      
      // Set the current user
      setCurrentUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Function to log in a user
  async function login(email, password) {
    try {
      setError('');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Store the token in localStorage
      localStorage.setItem('authToken', data.token);
      
      // Set the current user
      setCurrentUser(data.user);
      
      // Fetch subscription status
      await fetchSubscriptionStatus();
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Function to log out a user
  async function logout() {
    try {
      setError('');
      // Remove the token from localStorage
      localStorage.removeItem('authToken');
      
      // Clear the current user
      setCurrentUser(null);
      setUserSubscription(null);
      
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Function to fetch the current user's profile
  async function fetchCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return null;
      }
      
     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

      const data = await response.json();

      if (!response.ok) {
        // If token is invalid, clear it
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          setCurrentUser(null);
          setLoading(false);
          return null;
        }
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Function to fetch the user's subscription status
  async function fetchSubscriptionStatus() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token || !currentUser) {
        setUserSubscription(null);
        return null;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscriptions/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch subscription status');
      }

      setUserSubscription(data.subscription);
      return data.subscription;
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setUserSubscription(null);
      return null;
    }
  }

  // Function to update user profile
  async function updateProfile(userData) {
    try {
      setError('');
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update the current user with the new data
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...data.user
      }));
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Function to check if user has access to premium features
  function hasPremiumAccess() {
    return userSubscription && userSubscription.status === 'active';
  }

  // Effect to fetch the current user when the component mounts
  useEffect(() => {
    async function loadUserData() {
      const user = await fetchCurrentUser();
      if (user) {
        await fetchSubscriptionStatus();
      }
    }
    
    loadUserData();
  }, []);

  // Create the value object that will be provided to consumers
  const value = {
    currentUser,
    userSubscription,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    fetchCurrentUser,
    fetchSubscriptionStatus,
    hasPremiumAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
