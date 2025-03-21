import React, { useState, useEffect } from 'react';
import { FaTrophy, FaStar, FaMedal, FaGift } from 'react-icons/fa';
import '../styles/Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievementsAndRewards = async () => {
      try {
        const token = localStorage.getItem('token');
        const [achievementsResponse, rewardsResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/achievements`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/rewards`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!achievementsResponse.ok || !rewardsResponse.ok) {
          throw new Error('Failed to fetch achievements and rewards');
        }

        const [achievementsData, rewardsData] = await Promise.all([
          achievementsResponse.json(),
          rewardsResponse.json()
        ]);

        setAchievements(achievementsData);
        setRewards(rewardsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievementsAndRewards();
  }, []);

  if (loading) {
    return <div className="loading">Loading achievements and rewards...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="achievements-container">
      <section className="achievements-section">
        <h2><FaTrophy /> Achievements</h2>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.completed ? 'completed' : ''}`}
            >
              <div className="achievement-icon">
                <FaMedal />
              </div>
              <div className="achievement-content">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <div className="achievement-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${(achievement.progress / achievement.required) * 100}%` }}
                  />
                  <span className="progress-text">
                    {achievement.progress} / {achievement.required}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rewards-section">
        <h2><FaGift /> Available Rewards</h2>
        <div className="rewards-grid">
          {rewards.map((reward) => (
            <div 
              key={reward.id} 
              className={`reward-card ${reward.available ? 'available' : ''}`}
            >
              <div className="reward-icon">
                <FaStar />
              </div>
              <div className="reward-content">
                <h3>{reward.title}</h3>
                <p>{reward.description}</p>
                <div className="reward-cost">
                  <span className="cost">{reward.cost} points</span>
                  {reward.available && (
                    <button className="btn btn-primary claim-reward">
                      Claim Reward
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Achievements; 