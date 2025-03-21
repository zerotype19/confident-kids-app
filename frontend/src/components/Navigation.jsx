import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCrown } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout, userSubscription } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Confident Kids Logo" />
          <span>Confident Kids</span>
        </Link>
        
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link 
              to="/" 
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          
          {currentUser && (
            <>
              <li className="navbar-item">
                <Link 
                  to="/dashboard" 
                  className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </li>
              
              <li className="navbar-item">
                <Link 
                  to="/pillars" 
                  className={`navbar-link ${location.pathname.includes('/pillars') ? 'active' : ''}`}
                >
                  Pillars
                </Link>
              </li>
              
              <li className="navbar-item">
                <Link 
                  to="/challenges" 
                  className={`navbar-link ${location.pathname === '/challenges' ? 'active' : ''}`}
                >
                  Challenges
                </Link>
              </li>
              
              {userSubscription && userSubscription.status === 'active' && (
                <li className="navbar-item">
                  <Link 
                    to="/rewards" 
                    className={`navbar-link ${location.pathname === '/rewards' ? 'active' : ''}`}
                  >
                    Rewards
                    <span className="premium-badge">PRO</span>
                  </Link>
                </li>
              )}
              
              <li className="navbar-item">
                <Link 
                  to="/profile" 
                  className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
                >
                  <FaUser /> Profile
                </Link>
              </li>
              
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-link">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          )}
          
          {!currentUser && (
            <>
              <li className="navbar-item">
                <Link 
                  to="/about" 
                  className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}
                >
                  About
                </Link>
              </li>
              
              <li className="navbar-item">
                <Link 
                  to="/login" 
                  className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  Login
                </Link>
              </li>
              
              <li className="navbar-item">
                <Link 
                  to="/register" 
                  className="navbar-cta"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
          
          {currentUser && !userSubscription?.status === 'active' && (
            <li className="navbar-item">
              <Link 
                to="/subscription" 
                className="navbar-cta"
              >
                <FaCrown /> Upgrade
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
