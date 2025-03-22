import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Add useAuth import
import { ChildProvider } from './contexts/ChildContext';
import './styles/main.css';

// Components
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PillarDetail from './components/PillarDetail';
import PillarsOverview from './components/PillarsOverview';
import PillarTechniques from './components/PillarTechniques';
import Subscription from './components/Subscription';
import Rewards from './components/Rewards';
import Home from './components/Home';
import Profile from './components/Profile';
import Challenges from './pages/Challenges';
import ChallengeDetail from './components/ChallengeDetail';
import PillarView from './pages/PillarView';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="container mt-4"><div className="text-center p-5">Loading...</div></div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Premium route component
const PremiumRoute = ({ children }) => {
  const { hasPremiumAccess, loading } = useAuth();
  
  if (loading) {
    return <div className="container mt-4"><div className="text-center p-5">Loading...</div></div>;
  }
  
  if (!hasPremiumAccess()) {
    return <Navigate to="/subscription" />;
  }
  
  return children;
};

// Root redirect component
const RootRedirect = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="container mt-4"><div className="text-center p-5">Loading...</div></div>;
  }
  
  return <Navigate to={currentUser ? "/dashboard" : "/"} />;
};

const App = () => {
  return (
    <AuthProvider>
      <ChildProvider>
        <BrowserRouter>
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/pillars" element={
                <ProtectedRoute>
                  <PillarView />
                </ProtectedRoute>
              } />
              <Route path="/pillars/:pillarId" element={
                <ProtectedRoute>
                  <PillarDetail />
                </ProtectedRoute>
              } />
              <Route path="/pillars/:pillarId/techniques" element={
                <ProtectedRoute>
                  <PillarTechniques />
                </ProtectedRoute>
              } />
              <Route path="/challenges" element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              } />
              <Route path="/challenges/:challengeId" element={
                <ProtectedRoute>
                  <ChallengeDetail />
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              } />
              <Route path="/rewards" element={
                <ProtectedRoute>
                  <PremiumRoute>
                    <Rewards />
                  </PremiumRoute>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/" element={<RootRedirect />} />
            </Routes>
          </main>
        </BrowserRouter>
      </ChildProvider>
    </AuthProvider>
  );
};

export default App;

// Move the ReactDOM.render to a separate index.js file
// This should not be in App.js
