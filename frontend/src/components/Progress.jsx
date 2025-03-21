import React, { useState, useEffect } from 'react';
import { FaChartLine, FaCheckCircle, FaStar, FaTrophy, FaClock } from 'react-icons/fa';
import '../styles/Progress.css';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch progress statistics');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading progress statistics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!stats) {
    return <div className="no-stats">No progress statistics available</div>;
  }

  return (
    <div className="progress-container">
      <h2><FaChartLine /> Progress Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Completed Challenges</h3>
            <p className="stat-value">{stats.completedChallenges}</p>
            <p className="stat-label">Total challenges completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <h3>Points Earned</h3>
            <p className="stat-value">{stats.pointsEarned}</p>
            <p className="stat-label">Total points accumulated</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaTrophy />
          </div>
          <div className="stat-content">
            <h3>Achievements Unlocked</h3>
            <p className="stat-value">{stats.achievementsUnlocked}</p>
            <p className="stat-label">Total achievements earned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>Streak</h3>
            <p className="stat-value">{stats.currentStreak} days</p>
            <p className="stat-label">Current daily challenge streak</p>
          </div>
        </div>
      </div>

      <div className="progress-chart">
        <h3>Weekly Progress</h3>
        <div className="chart-container">
          {stats.weeklyProgress.map((day, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill"
                style={{ height: `${(day.completed / day.total) * 100}%` }}
              />
              <span className="day-label">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pillar-progress">
        <h3>Pillar Progress</h3>
        <div className="pillar-grid">
          {stats.pillarProgress.map((pillar) => (
            <div key={pillar.id} className="pillar-card">
              <h4>{pillar.name}</h4>
              <div className="pillar-progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${pillar.progress}%` }}
                />
              </div>
              <p className="progress-text">{pillar.progress}% Complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress; 