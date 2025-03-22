import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaStar, FaClock, FaUserFriends, FaCheck, FaArrowLeft } from 'react-icons/fa';
import '../styles/DailyChallenge.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (user && user.children && user.children.length > 0 && !selectedChild) {
      setSelectedChild(user.children[0].id);
    }
  }, [user]);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!user || !selectedChild) return;

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/api/challenges/${challengeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch challenge details');
        }

        const data = await response.json();
        setChallenge(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId, user, selectedChild]);

  const handleComplete = async () => {
    if (!challenge || !selectedChild) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/challenges/${challengeId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId: selectedChild,
          completed: !challenge.completed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update challenge status');
      }

      const data = await response.json();
      setChallenge({
        ...challenge,
        completed: !challenge.completed
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const selected = user.children.find(child => child.id === childId);
    setSelectedChild(selected);
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view challenge details.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Loading challenge details...</div>
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

  if (!challenge) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Challenge not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <button 
        className="btn btn-outline-secondary mb-3" 
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back to Challenges
      </button>

      <div className="daily-challenge">
        {user.children && user.children.length > 0 && (
          <div className="child-selector mb-4">
            <label htmlFor="childSelect">Select Child:</label>
            <select 
              id="childSelect" 
              className="form-control" 
              value={selectedChild?.id || ''} 
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

        <div className="challenge-header">
          <h2>{challenge.title}</h2>
          <div className="challenge-meta">
            <span className="difficulty">
              <FaStar /> {challenge.difficulty_level === 1 ? 'Easy' : 
                         challenge.difficulty_level === 2 ? 'Medium' : 'Hard'}
            </span>
            <span className="duration">
              <FaClock /> 15-20 minutes
            </span>
            <span className="age-range">
              <FaUserFriends /> {challenge.age_group === 'all' ? 'All Ages' : challenge.age_group}
            </span>
          </div>
        </div>

        <div className="challenge-content">
          <p>{challenge.description}</p>
          
          <div className="challenge-steps">
            <h4>Instructions for Parents:</h4>
            <div className="step">
              <span className="step-number">1</span>
              <p>Find a quiet, comfortable space with your child</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>Guide your child through the breathing exercise</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Practice together until your child feels comfortable</p>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <p>Encourage your child to use this technique when needed</p>
            </div>
          </div>

          <div className="challenge-rewards">
            <h4>Rewards</h4>
            <ul>
              <li>
                <FaStar className="reward-icon" />
                Builds emotional regulation skills
              </li>
              <li>
                <FaStar className="reward-icon" />
                Reduces anxiety and stress
              </li>
              <li>
                <FaStar className="reward-icon" />
                Strengthens parent-child bond
              </li>
            </ul>
          </div>

          <button 
            className={`btn ${challenge.completed ? 'btn-secondary' : 'btn-primary'} complete-challenge`}
            onClick={handleComplete}
          >
            <FaCheck /> {challenge.completed ? 'Mark as Incomplete' : 'Complete Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail; 