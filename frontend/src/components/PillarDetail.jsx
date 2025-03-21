import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProgressTracking from './ProgressTracking';
import { FaLock, FaCrown } from 'react-icons/fa';

const PillarDetail = () => {
  const { pillarId } = useParams();
  const [pillar, setPillar] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const { currentUser, hasPremiumAccess } = useAuth();
  const isPremium = hasPremiumAccess();

  useEffect(() => {
    const fetchPillarData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pillars/${pillarId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch pillar data');
        }

        setPillar(data.pillar);
        setActivities(data.activities);
        
        // Set the first child as selected by default if user has children
        if (currentUser.children && currentUser.children.length > 0) {
          setSelectedChild(currentUser.children[0].id);
        }
      } catch (error) {
        console.error('Error fetching pillar data:', error);
        setError('Failed to load pillar data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPillarData();
  }, [pillarId, currentUser]);

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
  };

  if (loading) {
    return <div className="text-center p-5">Loading pillar data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!pillar) {
    return <div className="text-center p-5">Pillar not found.</div>;
  }

  // Determine which activities to show based on subscription status
  const visibleActivities = isPremium 
    ? activities 
    : activities.slice(0, 1); // Only show first activity for free users

  return (
    <div className="container mt-4">
      <div className={`pillar-card pillar-card-${pillar.id} mb-4`}>
        <div className="pillar-card-header">
          <h1>{pillar.name}</h1>
        </div>
        <div className="pillar-card-body">
          <p>{pillar.description}</p>
          
          {currentUser.children && currentUser.children.length > 0 && (
            <div className="child-selector mb-4">
              <label htmlFor="childSelect">Select Child:</label>
              <select 
                id="childSelect" 
                className="form-control" 
                value={selectedChild} 
                onChange={handleChildChange}
              >
                {currentUser.children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} ({child.age} years)
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {selectedChild && (
            <ProgressTracking childId={selectedChild} />
          )}
        </div>
      </div>
      
      <h2 className="mb-3">Activities</h2>
      
      <div className="grid-2">
        {visibleActivities.map((activity) => (
          <div key={activity.id} className="card mb-4">
            <div className="card-header">
              <h3>{activity.title}</h3>
            </div>
            <div className="card-body">
              <p>{activity.description}</p>
              <h4>Instructions for Parents:</h4>
              <p>{activity.instructions}</p>
              
              <div className="mt-4">
                <Link to={`/pillars/${pillarId}/activities/${activity.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {!isPremium && activities.length > 1 && (
          <div className="premium-feature-container">
            <div className="premium-feature-preview">
              <div className="card mb-4">
                <div className="card-header">
                  <h3>Premium Activity</h3>
                </div>
                <div className="card-body">
                  <p>This premium activity helps your child develop confidence through guided exercises...</p>
                </div>
              </div>
            </div>
            <div className="premium-feature-overlay">
              <div className="lock-icon"><FaLock /></div>
              <h4>Premium Activities</h4>
              <p>Unlock {activities.length - 1} more activities for this pillar with a premium subscription</p>
              <Link to="/subscription" className="btn btn-secondary mt-2">
                <FaCrown className="me-2" /> Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {!isPremium && (
        <div className="upgrade-prompt standard mt-4">
          <h3><FaCrown className="me-2" /> Unlock All Activities</h3>
          <p>Subscribe to our premium plan to access all activities, detailed progress tracking, and rewards for your child.</p>
          <Link to="/subscription" className="upgrade-button">Upgrade Now</Link>
        </div>
      )}
    </div>
  );
};

export default PillarDetail;
