import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaStar, FaClock, FaUserFriends, FaCheck } from 'react-icons/fa';
import '../styles/Challenges.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const Challenges = () => {
  const { currentUser } = useAuth();
  const [activeChild, setActiveChild] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [weeklyChallenges, setWeeklyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [calendarChallenges, setCalendarChallenges] = useState([]);
  const [challenges, setChallenges] = useState({
    completed: 0,
    total: 0,
    streak: 0
  });

  useEffect(() => {
    if (currentUser && currentUser.children && currentUser.children.length > 0 && !activeChild) {
      setActiveChild(currentUser.children[0].id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!currentUser || !activeChild) return;

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch daily challenge
        const dailyResponse = await fetch(`${API_URL}/api/challenges/daily?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!dailyResponse.ok) {
          throw new Error('Failed to fetch daily challenge');
        }

        const dailyData = await dailyResponse.json();
        setDailyChallenge(dailyData.challenge);

        // Fetch weekly challenges
        const weeklyResponse = await fetch(`${API_URL}/api/challenges/weekly?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!weeklyResponse.ok) {
          throw new Error('Failed to fetch weekly challenges');
        }

        const weeklyData = await weeklyResponse.json();
        setWeeklyChallenges(weeklyData.challenges);

        // Fetch completed challenges
        const completedResponse = await fetch(`${API_URL}/api/challenges/completed?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (completedResponse.ok) {
          const completedData = await completedResponse.json();
          setCompletedChallenges(new Set(completedData.completed_challenges.map(c => c.id)));
        }

        // Fetch calendar challenges
        const calendarResponse = await fetch(`${API_URL}/api/challenges/calendar?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (calendarResponse.ok) {
          const calendarData = await calendarResponse.json();
          setCalendarChallenges(calendarData.challenges);
        }

        // Fetch progress tracking data
        const progressResponse = await fetch(`${API_URL}/api/progress?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setChallenges({
            completed: progressData.completedChallenges,
            total: progressData.totalChallenges,
            streak: progressData.streak || 0
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [currentUser, activeChild]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    setActiveChild(childId);
  };

  const handleCompleteChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/api/challenges/${challengeId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ childId: activeChild }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark challenge as complete');
      }

      // Update the completed challenges set
      setCompletedChallenges(prev => new Set([...prev, challengeId]));

      // If it's the daily challenge, refresh the challenges
      if (dailyChallenge && dailyChallenge.id === challengeId) {
        const dailyResponse = await fetch(`${API_URL}/api/challenges/daily?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          setDailyChallenge(dailyData.challenge);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCalendarChallengeToggle = async (day) => {
    if (!activeChild) {
      setError('No active child selected');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const challenge = calendarChallenges.find(c => c.day === day);
      
      // First, mark the challenge as complete
      const response = await fetch(`${API_URL}/api/challenges/${challenge.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId: activeChild,
          completed: !challenge.completed
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update challenge status: ${response.statusText}`);
      }

      // Then, update the progress tracking
      const progressResponse = await fetch(`${API_URL}/api/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId: activeChild,
          activityId: challenge.id,
          activityType: 'challenge',
          completed: !challenge.completed
        })
      });

      if (!progressResponse.ok) {
        throw new Error(`Failed to update progress: ${progressResponse.statusText}`);
      }

      // Update local state after successful API calls
      setCalendarChallenges(
        calendarChallenges.map(challenge => 
          challenge.day === day 
            ? { ...challenge, completed: !challenge.completed } 
            : challenge
        )
      );

      // Refresh the progress tracking data
      const progressDataResponse = await fetch(`${API_URL}/api/progress?childId=${activeChild}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (progressDataResponse.ok) {
        const progressData = await progressDataResponse.json();
        // Update the challenges state with the new progress data
        setChallenges({
          completed: progressData.completedChallenges,
          total: progressData.totalChallenges,
          streak: progressData.streak || 0
        });
      }
    } catch (err) {
      console.error('Error updating challenge status:', err);
      setError(`Failed to update challenge status. Please try again later.`);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view challenges.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Loading challenges...</div>
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

  return (
    <div className="container mt-4">
      <div className="child-selector mb-4">
        <label htmlFor="childSelect">Select Child:</label>
        <select 
          id="childSelect" 
          className="form-control" 
          value={activeChild || ''} 
          onChange={handleChildChange}
        >
          {currentUser.children.map(child => (
            <option key={child.id} value={child.id}>
              {child.name} ({child.age} years)
            </option>
          ))}
        </select>
      </div>

      <div className="challenges-tabs">
        <button 
          className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily Challenge
        </button>
        <button 
          className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly Challenges
        </button>
        <button 
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
      </div>

      {activeTab === 'daily' ? (
        <div className="daily-challenge">
          {dailyChallenge ? (
            <>
              <h2>{dailyChallenge.title}</h2>
              <div className="challenge-meta">
                <span className="difficulty">
                  <FaStar /> {dailyChallenge.difficulty_level === 1 ? 'Easy' : 
                             dailyChallenge.difficulty_level === 2 ? 'Medium' : 'Hard'}
                </span>
                <span className="duration">
                  <FaClock /> 15-20 minutes
                </span>
                <span className="age-range">
                  <FaUserFriends /> {dailyChallenge.age_group === 'all' ? 'All Ages' : dailyChallenge.age_group}
                </span>
              </div>
              <p>{dailyChallenge.description}</p>
              {completedChallenges.has(dailyChallenge.id) ? (
                <Link 
                  to="/challenges" 
                  className="btn btn-success"
                >
                  <FaCheck /> View All Challenges
                </Link>
              ) : (
                <button 
                  onClick={() => handleCompleteChallenge(dailyChallenge.id)}
                  className="btn btn-primary"
                >
                  Mark as Complete
                </button>
              )}
            </>
          ) : (
            <div className="text-center p-5">
              No daily challenge available at the moment.
            </div>
          )}
        </div>
      ) : activeTab === 'weekly' ? (
        <div className="weekly-challenges">
          {weeklyChallenges.length > 0 ? (
            <div className="challenges-grid">
              {weeklyChallenges.map(challenge => (
                <div key={challenge.id} className="challenge-card">
                  <h3>{challenge.title}</h3>
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
                  <p>{challenge.description}</p>
                  {completedChallenges.has(challenge.id) ? (
                    <Link 
                      to="/challenges" 
                      className="btn btn-success"
                    >
                      <FaCheck /> View All Challenges
                    </Link>
                  ) : (
                    <button 
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      className="btn btn-primary"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-5">
              No weekly challenges available at the moment.
            </div>
          )}
        </div>
      ) : (
        <div className="calendar-challenges-tab">
          <div className="calendar-header">
            <h2>30-Day Challenge Calendar</h2>
            <p>Complete one challenge each day to build lasting confidence and skills.</p>
            <div className="progress-stats">
              <div className="stat-card">
                <h3>Challenges Completed</h3>
                <p className="stat-number">{challenges.completed}/{challenges.total}</p>
              </div>
              <div className="stat-card">
                <h3>Current Streak</h3>
                <p className="stat-number">{challenges.streak} days</p>
              </div>
            </div>
          </div>

          <div className="calendar-challenges">
            {calendarChallenges.map(challenge => (
              <div 
                key={challenge.day} 
                className={`calendar-day ${challenge.completed ? 'completed' : ''}`}
              >
                <div className="day-number">Day {challenge.day}</div>
                <div className="day-content">
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                </div>
                <div className="day-action">
                  <button 
                    className={`btn ${challenge.completed ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleCalendarChallengeToggle(challenge.day)}
                  >
                    {challenge.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges; 