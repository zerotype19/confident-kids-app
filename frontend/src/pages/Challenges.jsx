import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChild } from '../contexts/ChildContext';
import { FaStar, FaClock, FaUserFriends, FaCheck } from 'react-icons/fa';
import ChildSelector from '../components/ChildSelector';
import ChallengeCard from '../components/ChallengeCard';
import '../styles/Challenges.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const Challenges = () => {
  const { currentUser } = useAuth();
  const { activeChild, setActiveChild } = useChild();
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
    streak: 0,
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear()
  });

  useEffect(() => {
    if (currentUser && currentUser.children && currentUser.children.length > 0 && !activeChild) {
      setActiveChild(currentUser.children[0].id);
    }
  }, [currentUser, setActiveChild]);

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

        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Fetch daily challenge
        const dailyResponse = await fetch(`${API_URL}/api/challenges/daily?childId=${activeChild}&month=${currentMonth}&year=${currentYear}`, {
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
        const weeklyResponse = await fetch(`${API_URL}/api/challenges/weekly?childId=${activeChild}&month=${currentMonth}&year=${currentYear}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!weeklyResponse.ok) {
          throw new Error('Failed to fetch weekly challenges');
        }

        const weeklyData = await weeklyResponse.json();
        setWeeklyChallenges(weeklyData.challenges);

        // Fetch completed challenges for current month
        const completedResponse = await fetch(`${API_URL}/api/challenges/completed?childId=${activeChild}&month=${currentMonth}&year=${currentYear}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (completedResponse.ok) {
          const completedData = await completedResponse.json();
          setCompletedChallenges(new Set(completedData.completed_challenges.map(c => c.id)));
        }

        // Fetch calendar challenges
        const calendarResponse = await fetch(`${API_URL}/api/challenges/calendar?childId=${activeChild}&month=${currentMonth}&year=${currentYear}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (calendarResponse.ok) {
          const calendarData = await calendarResponse.json();
          setCalendarChallenges(calendarData.challenges);
        }

        // Fetch progress tracking data for current month
        const progressResponse = await fetch(`${API_URL}/api/progress?childId=${activeChild}&month=${currentMonth}&year=${currentYear}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setChallenges({
            completed: progressData.completedChallenges,
            total: progressData.totalChallenges,
            streak: progressData.streak || 0,
            currentMonth,
            currentYear
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
    if (!challengeId) {
      setError('Invalid challenge ID');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!activeChild) {
        throw new Error('No active child selected');
      }

      const response = await fetch(`${API_URL}/api/challenges/${challengeId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          childId: activeChild,
          completed: true 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark challenge as complete');
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
      console.error('Error completing challenge:', err);
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
      
      // Get current month and year
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      // Mark the challenge as complete
      const response = await fetch(`${API_URL}/api/challenges/${challenge.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId: activeChild,
          completed: true
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update challenge status: ${response.statusText}`);
      }

      // Update local state after successful API call
      setCalendarChallenges(
        calendarChallenges.map(c => 
          c.day === day 
            ? { ...c, completed: true } 
            : c
        )
      );

      // Refresh the progress tracking data for current month
      const progressDataResponse = await fetch(`${API_URL}/api/progress?childId=${activeChild}&month=${currentMonth}&year=${currentYear}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (progressDataResponse.ok) {
        const progressData = await progressDataResponse.json();
        setChallenges({
          completed: progressData.completedChallenges,
          total: progressData.totalChallenges,
          streak: progressData.streak || 0,
          currentMonth,
          currentYear
        });
      }
    } catch (err) {
      console.error('Error toggling calendar challenge:', err);
      setError(err.message);
    }
  };

  const renderDailyChallenge = () => {
    if (!dailyChallenge) return null;

    return (
      <div className="daily-challenge-section">
        <h2>Today's Challenge</h2>
        <ChallengeCard
          challenge={dailyChallenge}
          childId={activeChild}
          onComplete={handleCompleteChallenge}
          isCompleted={completedChallenges.has(dailyChallenge.id)}
        />
      </div>
    );
  };

  const renderWeeklyChallenges = () => {
    if (!weeklyChallenges.length) return null;

    return (
      <div className="weekly-challenges-section">
        <h2>Weekly Challenges</h2>
        <div className="challenges-grid">
          {weeklyChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              childId={activeChild}
              onComplete={handleCompleteChallenge}
              isCompleted={completedChallenges.has(challenge.id)}
            />
          ))}
        </div>
      </div>
    );
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
    return <div className="loader">Loading challenges...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="challenges-page">
      <div className="challenges-header">
        <h1>30-Day Challenges</h1>
        <ChildSelector />
      </div>
      {activeChild ? (
        <>
          <div className="progress-stats">
            <div className="stat-card">
              <h3>Completed</h3>
              <div className="stat-number">{challenges.completed}</div>
            </div>
            <div className="stat-card">
              <h3>Total</h3>
              <div className="stat-number">{challenges.total}</div>
            </div>
            <div className="stat-card">
              <h3>Streak</h3>
              <div className="stat-number">{challenges.streak}</div>
            </div>
          </div>
          <div className="challenges-grid">
            {calendarChallenges.map(challenge => (
              <div key={challenge.id} className={`calendar-day ${challenge.completed ? 'completed' : ''}`}>
                <div className="day-number">Day {challenge.day}</div>
                <div className="day-content">
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                  {!challenge.completed && (
                    <div className="day-action">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleCalendarChallengeToggle(challenge.day)}
                      >
                        Complete
                      </button>
                    </div>
                  )}
                  {challenge.completed && (
                    <div className="completed-state">
                      <FaCheck />
                      <span>Completed!</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="alert alert-info">
          Please select a child to view their challenges.
        </div>
      )}
    </div>
  );
};

export default Challenges; 