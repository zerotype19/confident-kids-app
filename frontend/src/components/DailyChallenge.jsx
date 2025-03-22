import React, { useState, useEffect } from 'react';
import { FaCheck, FaStar, FaClock } from 'react-icons/fa';
import '../styles/DailyChallenge.css';

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/challenges/daily`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch daily challenge');
        }

        const data = await response.json();
        setChallenge(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, []);

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/challenges/${challenge.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId: challenge.childId,
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

  if (loading) {
    return <div className="loading">Loading daily challenge...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!challenge) {
    return <div className="no-challenge">No daily challenge available</div>;
  }

  return (
    <div className="daily-challenge">
      <div className="challenge-header">
        <h2>Today's Challenge</h2>
        <div className="challenge-meta">
          <span className="difficulty">
            <FaStar /> {challenge.difficulty}
          </span>
          <span className="duration">
            <FaClock /> {challenge.duration} minutes
          </span>
        </div>
      </div>

      <div className="challenge-content">
        <h3>{challenge.title}</h3>
        <p>{challenge.description}</p>
        
        <div className="challenge-steps">
          {challenge.steps.map((step, index) => (
            <div key={index} className="step">
              <span className="step-number">{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <div className="challenge-rewards">
          <h4>Rewards</h4>
          <ul>
            {challenge.rewards.map((reward, index) => (
              <li key={index}>
                <FaStar className="reward-icon" />
                {reward}
              </li>
            ))}
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
  );
};

export default DailyChallenge; 