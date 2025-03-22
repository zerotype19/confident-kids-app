import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaStar, FaClock, FaUserFriends, FaCheck, FaArrowLeft } from 'react-icons/fa';
import '../styles/DailyChallenge.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.children && currentUser.children.length > 0 && !selectedChild) {
      setSelectedChild(currentUser.children[0].id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!currentUser || !selectedChild) return;

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
  }, [challengeId, currentUser, selectedChild]);

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
    const selected = currentUser.children.find(child => child.id === childId);
    setSelectedChild(selected);
  };

  if (!currentUser) {
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
        {currentUser.children && currentUser.children.length > 0 && (
          <div className="child-selector mb-4">
            <label htmlFor="childSelect">Select Child:</label>
            <select 
              id="childSelect" 
              className="form-control" 
              value={selectedChild?.id || ''} 
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
          <p className="description">{challenge.description}</p>
          
          <div className="instructions">
            <h4>Instructions for Parents:</h4>
            <p>{challenge.instructions}</p>
          </div>

          {challenge.materials && (
            <div className="materials">
              <h4>Materials Needed:</h4>
              <p>{challenge.materials}</p>
            </div>
          )}

          <div className="challenge-actions">
            <button 
              className={`btn ${challenge.completed ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleComplete}
            >
              <FaCheck className="me-2" />
              {challenge.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail; 