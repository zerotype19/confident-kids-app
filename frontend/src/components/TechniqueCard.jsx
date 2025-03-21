import React, { useState } from 'react';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import '../styles/TechniqueCard.css';

const TechniqueCard = ({ technique, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleStepComplete = (stepIndex) => {
    setCompletedSteps(prev => {
      if (prev.includes(stepIndex)) {
        return prev.filter(i => i !== stepIndex);
      }
      return [...prev, stepIndex];
    });
  };

  const handleComplete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/content/${technique.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          completedSteps,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark technique as complete');
      }

      onComplete && onComplete(technique.id);
      setIsExpanded(false);
    } catch (error) {
      console.error('Error completing technique:', error);
    }
  };

  const steps = technique.content_data.steps;
  const isFullyCompleted = completedSteps.length === steps.length;

  return (
    <div className="technique-card">
      <div 
        className="technique-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{technique.title}</h3>
        <p className="technique-description">{technique.description}</p>
        <div className="technique-meta">
          <span className="age-group">{technique.age_group}</span>
          <span className="content-type">{technique.content_type}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="technique-content">
          <div className="steps-container">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`step ${completedSteps.includes(index) ? 'completed' : ''}`}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <p>{step}</p>
                  <button
                    className="step-complete-btn"
                    onClick={() => handleStepComplete(index)}
                  >
                    {completedSteps.includes(index) ? (
                      <FaCheck className="icon" />
                    ) : (
                      <FaArrowRight className="icon" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="technique-actions">
            <button
              className={`btn btn-primary ${isFullyCompleted ? 'completed' : ''}`}
              onClick={handleComplete}
              disabled={!isFullyCompleted}
            >
              {isFullyCompleted ? 'Completed!' : 'Complete All Steps'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniqueCard; 