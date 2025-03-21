import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaChartLine, FaTrophy, FaCalendarAlt, FaChild, FaStar } from 'react-icons/fa';

const ProgressTracking = ({ childId, pillarId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, hasPremiumAccess } = useAuth();
  const isPremium = hasPremiumAccess();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        // Fetch progress statistics
        const statsResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/progress/stats/child/${childId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch progress statistics');
        }

        const statsData = await statsResponse.json();

        // If pillarId is provided, fetch specific pillar progress
        if (pillarId) {
          const pillarResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/progress/pillar/${pillarId}/child/${childId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          if (!pillarResponse.ok) {
            throw new Error('Failed to fetch pillar progress');
          }

          const pillarData = await pillarResponse.json();
          setProgress({
            ...statsData,
            pillarProgress: pillarData,
          });
        } else {
          setProgress(statsData);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [childId, pillarId]);

  const updateProgress = async (pillarId, activityId, completed) => {
    if (!childId) return;
    
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/progress/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          childId,
          pillarId,
          activityId,
          completed
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update progress');
      }

      // Update local state with new progress data
      setProgress(prevData => {
        const updatedPillars = prevData.pillars.map(pillar => {
          if (pillar.id === pillarId) {
            const updatedActivities = pillar.activities.map(activity => {
              if (activity.id === activityId) {
                return { ...activity, completed };
              }
              return activity;
            });
            return { ...pillar, activities: updatedActivities };
          }
          return pillar;
        });
        
        return {
          ...prevData,
          pillars: updatedPillars
        };
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress. Please try again later.');
    }
  };

  if (loading) {
    return <div className="progress-loading">Loading progress...</div>;
  }

  if (error) {
    return <div className="progress-error">{error}</div>;
  }

  if (!progress) {
    return null;
  }

  return (
    <div className="progress-tracking">
      <div className="progress-summary">
        <div className="progress-stat">
          <FaTrophy className="icon" />
          <div className="stat-content">
            <span className="stat-value">{progress.totalCompleted}</span>
            <span className="stat-label">Challenges Completed</span>
          </div>
        </div>
        
        <div className="progress-stat">
          <FaStar className="icon" />
          <div className="stat-content">
            <span className="stat-value">{progress.averageRating.toFixed(1)}</span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
      </div>

      {pillarId && progress.pillarProgress && (
        <div className="pillar-progress">
          <h3>Recent Challenges</h3>
          <div className="recent-challenges">
            {progress.pillarProgress.slice(0, 3).map((entry) => (
              <div key={entry.id} className="recent-challenge">
                <div className="challenge-info">
                  <h4>{entry.activity.title}</h4>
                  <div className="challenge-meta">
                    <span className="rating">
                      <FaStar /> {entry.rating}
                    </span>
                    <span className="date">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {entry.notes && (
                  <p className="challenge-notes">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="progress-by-pillar">
        <h3>Progress by Pillar</h3>
        <div className="pillars-grid">
          {progress.progressByPillar.map((pillarProgress) => (
            <div key={pillarProgress.pillarId} className="pillar-progress-card">
              <div className="pillar-header">
                <h4>{pillarProgress.pillar.name}</h4>
                <span className="pillar-icon">{pillarProgress.pillar.icon}</span>
              </div>
              <div className="pillar-stats">
                <div className="stat">
                  <FaChartLine className="icon" />
                  <span>{pillarProgress._count.id} completed</span>
                </div>
                <div className="stat">
                  <FaStar className="icon" />
                  <span>{pillarProgress._avg.rating.toFixed(1)} avg rating</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
