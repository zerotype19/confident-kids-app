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
  const { currentUser, loading: authLoading, hasPremiumAccess } = useAuth();
  const isPremium = hasPremiumAccess();

  useEffect(() => {
    if (currentUser && currentUser.children && currentUser.children.length > 0 && !selectedChild) {
      console.log('Setting initial selected child:', currentUser.children[0].id);
      setSelectedChild(currentUser.children[0].id);
    } else {
      console.log('User state:', {
        hasUser: !!currentUser,
        hasChildren: currentUser?.children?.length > 0,
        children: currentUser?.children,
        selectedChild,
        currentUser
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetch data called with:', {
        hasUser: !!currentUser,
        userChildren: currentUser?.children,
        selectedChild,
        pillarId,
        currentUser
      });

      if (!currentUser) {
        console.log('No user found, waiting for auth...');
        return;
      }

      if (!currentUser.children || currentUser.children.length === 0) {
        console.log('User has no children');
        setLoading(false);
        return;
      }

      if (!selectedChild) {
        console.log('No child selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('authToken');
        console.log('Fetching data with:', {
          hasToken: !!token,
          selectedChild,
          pillarId
        });
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Fetch pillar data and challenges in parallel
        const [pillarResponse, challengesResponse] = await Promise.all([
          fetch(`${API_URL}/api/pillars/${pillarId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(
            `${API_URL}/api/pillars/${pillarId}/challenges?childId=${selectedChild}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          )
        ]);

        if (!pillarResponse.ok) {
          const pillarData = await pillarResponse.json();
          console.error('Pillar response error:', pillarData);
          throw new Error(pillarData.message || 'Failed to fetch pillar data');
        }

        if (!challengesResponse.ok) {
          const challengesData = await challengesResponse.json();
          throw new Error(challengesData.message || 'Failed to fetch challenges');
        }

        const [pillarData, challengesData] = await Promise.all([
          pillarResponse.json(),
          challengesResponse.json()
        ]);

        console.log('Pillar data:', pillarData);
        console.log('Challenges data:', challengesData);

        setPillar(pillarData);
        setChallenges(challengesData.challenges || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pillarId, currentUser, selectedChild]);

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
  };

  const handleChallengeComplete = (challengeId) => {
    setChallenges(challenges.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true }
        : challenge
    ));
  };

  if (authLoading || loading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Loading pillar data...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view pillar details.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!pillar) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Pillar not found.</div>
      </div>
    );
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
          
          {currentUser.children && currentUser.children.length > 0 ? (
            <div className="child-selector mb-4">
              <label htmlFor="childSelect">Select Child:</label>
              <select 
                id="childSelect" 
                className="form-control" 
                value={selectedChild || ''} 
                onChange={handleChildChange}
              >
                <option value="">Select a child</option>
                {currentUser.children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} ({child.age} years)
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="alert alert-info">
              Please add a child to your profile to view challenges.
            </div>
          )}
          
          {selectedChild && (
            <ProgressTracking childId={selectedChild} pillarId={pillarId} />
          )}
        </div>
      </div>
      
      {selectedChild ? (
        <>
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
        </>
      ) : (
        <div className="alert alert-info">
          Please select a child to view challenges.
        </div>
      )}
    </div>
  );
};

export default PillarDetail;
