import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import '../styles/PillarsOverview.css';

const PillarsOverview = () => {
  const [pillars, setPillars] = useState([]);
  const [content, setContent] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        // Fetch pillars
        const pillarsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/pillars`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Fetch content (techniques)
        const contentResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/content`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Fetch challenges
        const challengesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/challenges`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Fetch achievements
        const achievementsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/achievements`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const [pillarsData, contentData, challengesData, achievementsData] = await Promise.all([
          pillarsResponse.json(),
          contentResponse.json(),
          challengesResponse.json(),
          achievementsResponse.json(),
        ]);

        setPillars(pillarsData);
        setContent(contentData);
        setChallenges(challengesData);
        setAchievements(achievementsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading pillars...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="pillars-overview">
      <div className="daily-challenge-section">
        <h2>Today's Challenge</h2>
        {challenges.length > 0 && (
          <div className="daily-challenge">
            <h3>{challenges[0].title}</h3>
            <p>{challenges[0].description}</p>
            <Link to={`/challenges/${challenges[0].id}`} className="btn btn-primary">
              Start Challenge
            </Link>
          </div>
        )}
      </div>

      <div className="pillars-grid">
        {pillars.map(pillar => {
          const pillarContent = content.filter(c => c.pillar_id === pillar.id);
          const pillarChallenges = challenges.filter(c => c.pillar_id === pillar.id);
          const pillarAchievements = achievements.filter(a => 
            a.description.includes(pillar.name)
          );

          return (
            <div key={pillar.id} className="pillar-card">
              <div className="pillar-header">
                <h3>{pillar.name}</h3>
                <p className="pillar-description">{pillar.short_description}</p>
              </div>

              <div className="pillar-stats">
                <div className="stat">
                  <FaStar className="icon" />
                  <span>{pillarContent.length} Techniques</span>
                </div>
                <div className="stat">
                  <FaCalendarAlt className="icon" />
                  <span>{pillarChallenges.length} Challenges</span>
                </div>
                <div className="stat">
                  <FaTrophy className="icon" />
                  <span>{pillarAchievements.length} Achievements</span>
                </div>
              </div>

              <div className="pillar-actions">
                <Link to={`/pillars/${pillar.id}`} className="btn btn-primary">
                  Explore Pillar
                </Link>
                <Link to={`/pillars/${pillar.id}/techniques`} className="btn btn-secondary">
                  View Techniques
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="achievements-section">
        <h2>Available Achievements</h2>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div key={achievement.id} className="achievement-card">
              <div className="achievement-header">
                <h3>{achievement.name}</h3>
                <span className="points">{achievement.points_value} points</span>
              </div>
              <p>{achievement.description}</p>
              {achievement.creates_certificate && (
                <span className="certificate-badge">Certificate Available</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PillarsOverview; 