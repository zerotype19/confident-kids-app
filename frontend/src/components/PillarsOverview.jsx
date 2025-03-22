import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../styles/PillarsOverview.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const PillarsOverview = () => {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState(null);
  const [pillars, setPillars] = useState([]);
  const [content, setContent] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.children && user.children.length > 0 && !selectedChild) {
      setSelectedChild(user.children[0].id);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !selectedChild) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        // Fetch pillars with child progress
        const pillarsResponse = await fetch(`${API_URL}/api/pillars?childId=${selectedChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!pillarsResponse.ok) {
          const errorData = await pillarsResponse.json();
          throw new Error(errorData.error || 'Failed to fetch pillars data');
        }
        
        // Fetch content (techniques)
        const contentResponse = await fetch(`${API_URL}/api/content`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Fetch challenges
        const challengesResponse = await fetch(`${API_URL}/api/challenges?childId=${selectedChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Fetch achievements
        const achievementsResponse = await fetch(`${API_URL}/api/achievements?childId=${selectedChild}`, {
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
        setError(error.message || 'Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, selectedChild]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const selected = user.children.find(child => child.id === childId);
    setSelectedChild(selected);
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view pillars.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Loading pillars...</div>
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
      {user.children && user.children.length > 0 && (
        <div className="child-selector mb-4">
          <label htmlFor="childSelect">Select Child:</label>
          <select 
            id="childSelect" 
            className="form-control" 
            value={selectedChild?.id || ''} 
            onChange={handleChildChange}
          >
            {user.children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} ({child.age} years)
              </option>
            ))}
          </select>
        </div>
      )}

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

                <div className="pillar-progress">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>{pillar.progress || 0}%</span>
                  </div>
                  <div className="progress-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${pillar.progress || 0}%` }}
                    ></div>
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
    </div>
  );
};

export default PillarsOverview; 