import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaUserFriends } from 'react-icons/fa';

const ChallengeCard = ({ challenge, childId, pillarId, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  const handleComplete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/challenges/${challenge.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          childId,
          completed: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark challenge as complete');
      }

      onComplete && onComplete(challenge.id);
      setIsExpanded(false);
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  return (
    <div className="challenge-card">
      <div className="challenge-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{challenge.title}</h3>
        <div className="challenge-meta">
          <span className="difficulty">
            <FaStar className={challenge.difficulty === 'easy' ? 'text-success' : 
                           challenge.difficulty === 'medium' ? 'text-warning' : 'text-danger'} />
            {challenge.difficulty}
          </span>
          <span className="duration">
            <FaClock /> {challenge.durationMinutes} min
          </span>
          <span className="age-range">
            <FaUserFriends /> {challenge.minAge}-{challenge.maxAge} years
          </span>
        </div>
      </div>

      {isExpanded && (
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

          <div className="completion-form">
            <h4>Complete Challenge</h4>
            <div className="rating-input">
              <label>Rating (1-5):</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star ${star <= rating ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            
            <div className="notes-input">
              <label>Notes:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about how the challenge went..."
              />
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleComplete}
              disabled={rating === 0}
            >
              Mark as Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard; 