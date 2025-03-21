import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProgressTracking from './ProgressTracking';
import ChallengeCard from './ChallengeCard';
import { FaLock, FaCrown } from 'react-icons/fa';
import '../styles/ChallengeCard.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const PillarDetail = () => {
  const { pillarId } = useParams();
  const [pillar, setPillar] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const { user, hasPremiumAccess } = useAuth();
  const isPremium = hasPremiumAccess();

  useEffect(() => {
    const fetchPillarData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch pillar data
        const pillarResponse = await fetch(`${API_URL}/api/pillars/${pillarId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const pillarData = await pillarResponse.json();

        if (!pillarResponse.ok) {
          throw new Error(pillarData.message || 'Failed to fetch pillar data');
        }

        setPillar(pillarData);

        // Set the first child as selected by default if user has children
        if (user.children && user.children.length > 0 && !selectedChild) {
          setSelectedChild(user.children[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPillarData();
  }, [pillarId, user]);

  // Separate useEffect for fetching challenges when child is selected
  useEffect(() => {
    const fetchChallenges = async () => {
      if (!selectedChild) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch challenges for the pillar
        const challengesResponse = await fetch(
          `${API_URL}/api/pillars/${pillarId}/challenges?childId=${selectedChild}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const challengesData = await challengesResponse.json();

        if (!challengesResponse.ok) {
          throw new Error(challengesData.message || 'Failed to fetch challenges');
        }

        setChallenges(challengesData.challenges || []);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        setError('Failed to load challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [pillarId, selectedChild]);

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
  };

  const handleChallengeComplete = (challengeId) => {
    // Update the challenges list to reflect completion
    setChallenges(challenges.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true }
        : challenge
    ));
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

  // Determine which challenges to show based on subscription status
  const visibleChallenges = isPremium 
    ? challenges 
    : challenges.slice(0, 1); // Only show first challenge for free users

  return (
    <div className="container mt-4">
      <div className={`pillar-card pillar-card-${pillar.id} mb-4`}>
        <div className="pillar-card-header">
          <h1>{pillar.name}</h1>
          {pillar.icon && <span className="pillar-icon">{pillar.icon}</span>}
        </div>
        <div className="pillar-card-body">
          <p>{pillar.shortDescription}</p>
          
          {user.children && user.children.length > 0 && (
            <div className="child-selector mb-4">
              <label htmlFor="childSelect">Select Child:</label>
              <select 
                id="childSelect" 
                className="form-control" 
                value={selectedChild} 
                onChange={handleChildChange}
              >
                {user.children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} ({child.age} years)
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {selectedChild && (
            <ProgressTracking childId={selectedChild} pillarId={pillarId} />
          )}
        </div>
      </div>
      
      <h2 className="mb-3">Confidence Challenges</h2>
      
      <div className="challenges-grid">
        {visibleChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            childId={selectedChild}
            pillarId={pillarId}
            onComplete={handleChallengeComplete}
          />
        ))}
        
        {!isPremium && challenges.length > 1 && (
          <div className="premium-feature-container">
            <div className="premium-feature-preview">
              <ChallengeCard
                challenge={{
                  id: 'preview',
                  title: 'Premium Challenge',
                  description: 'This premium challenge helps your child develop confidence through guided exercises...',
                  difficulty: 'medium',
                  durationMinutes: 15,
                  minAge: 5,
                  maxAge: 12,
                }}
                childId={selectedChild}
                pillarId={pillarId}
              />
            </div>
            <div className="premium-feature-overlay">
              <div className="lock-icon"><FaLock /></div>
              <h4>Premium Challenges</h4>
              <p>Unlock {challenges.length - 1} more challenges for this pillar with a premium subscription</p>
              <Link to="/subscription" className="btn btn-secondary mt-2">
                <FaCrown className="me-2" /> Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {!isPremium && (
        <div className="upgrade-prompt standard mt-4">
          <h3><FaCrown className="me-2" /> Unlock All Challenges</h3>
          <p>Subscribe to our premium plan to access all challenges, detailed progress tracking, and rewards for your child.</p>
          <Link to="/subscription" className="upgrade-button">Upgrade Now</Link>
        </div>
      )}
    </div>
  );
};

export default PillarDetail;
