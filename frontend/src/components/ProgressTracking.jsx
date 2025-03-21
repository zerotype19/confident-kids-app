import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaChartLine, FaTrophy, FaCalendarAlt, FaChild } from 'react-icons/fa';

const ProgressTracking = ({ childId }) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, hasPremiumAccess } = useAuth();
  const isPremium = hasPremiumAccess();

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!childId) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/progress/${childId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch progress data');
        }

        setProgressData(data.progress);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError('Failed to load progress data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [childId]);

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
      setProgressData(prevData => {
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
    return <div className="text-center p-5">Loading progress data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!progressData) {
    return <div className="text-center p-5">No progress data available.</div>;
  }

  return (
    <div className="progress-tracking-container">
      <div className="dashboard-stats">
        <div className="stat-card">
          <FaChartLine className="mb-2" size={24} />
          <div className="stat-value">{progressData.overallProgress}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
        
        <div className="stat-card">
          <FaTrophy className="mb-2" size={24} />
          <div className="stat-value">{progressData.activitiesCompleted}</div>
          <div className="stat-label">Activities Completed</div>
        </div>
        
        <div className="stat-card">
          <FaCalendarAlt className="mb-2" size={24} />
          <div className="stat-value">{progressData.currentStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>
      
      <h3 className="mb-3">Progress by Pillar</h3>
      
      {progressData.pillars.map((pillar) => (
        <div key={pillar.id} className="mb-4">
          <div className="progress-label">
            <span>{pillar.name}</span>
            <span>{pillar.progress}%</span>
          </div>
          <div className="progress-container">
            <div 
              className={`progress-bar progress-bar-${pillar.id}`} 
              style={{ width: `${pillar.progress}%` }}
            ></div>
          </div>
          
          {isPremium ? (
            <div className="activities-list mt-3">
              <h5>Activities</h5>
              {pillar.activities.map((activity) => (
                <div key={activity.id} className="activity-item d-flex align-items-center justify-content-between p-2">
                  <div>
                    <input
                      type="checkbox"
                      id={`activity-${activity.id}`}
                      checked={activity.completed}
                      onChange={(e) => updateProgress(pillar.id, activity.id, e.target.checked)}
                      className="me-2"
                    />
                    <label htmlFor={`activity-${activity.id}`}>{activity.name}</label>
                  </div>
                  <span className="text-muted">{activity.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="premium-feature-container mt-3">
              <div className="premium-feature-preview">
                <div className="activities-list">
                  <h5>Activities</h5>
                  {pillar.activities.slice(0, 1).map((activity) => (
                    <div key={activity.id} className="activity-item d-flex align-items-center justify-content-between p-2">
                      <div>
                        <input
                          type="checkbox"
                          id={`activity-${activity.id}`}
                          checked={activity.completed}
                          onChange={(e) => updateProgress(pillar.id, activity.id, e.target.checked)}
                          className="me-2"
                        />
                        <label htmlFor={`activity-${activity.id}`}>{activity.name}</label>
                      </div>
                      <span className="text-muted">{activity.date}</span>
                    </div>
                  ))}
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="activity-item d-flex align-items-center justify-content-between p-2">
                      <div>
                        <span className="me-2">□</span>
                        <span>Premium Activity {i + 1}</span>
                      </div>
                      <span className="text-muted">Locked</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="premium-feature-overlay">
                <div className="lock-icon">🔒</div>
                <h4>Premium Feature</h4>
                <p>Unlock detailed activity tracking with a premium subscription</p>
                <a href="/subscription" className="btn btn-secondary mt-2">Upgrade Now</a>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isPremium && (
        <div className="calendar-section mt-5">
          <h3 className="mb-3">Activity Calendar</h3>
          <div className="calendar-container">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="calendar-header">{day}</div>
            ))}
            
            {progressData.calendar.map((day) => (
              <div 
                key={day.date} 
                className={`calendar-day ${day.completed ? 'completed' : ''} ${day.isToday ? 'today' : ''} ${day.isFuture ? 'future' : ''}`}
                title={day.activities.join(', ')}
              >
                <div>{new Date(day.date).getDate()}</div>
                {day.completed && <div className="calendar-badge">✓</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!isPremium && (
        <div className="upgrade-prompt standard mt-5">
          <h3><FaChild className="me-2" /> Unlock Advanced Progress Tracking</h3>
          <p>Subscribe to our premium plan to access detailed progress tracking, activity calendars, and achievement certificates for your child.</p>
          <a href="/subscription" className="upgrade-button">Upgrade Now</a>
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;
