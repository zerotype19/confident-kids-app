import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProgressTracker = () => {
  const { user } = useContext(AuthContext);
  const [activeChild, setActiveChild] = useState(null);
  const [pillars, setPillars] = useState([
    {
      id: 1,
      title: 'Independence & Problem-Solving',
      progress: 20,
      activities: 4,
      totalActivities: 20
    },
    {
      id: 2,
      title: 'Growth Mindset & Resilience',
      progress: 15,
      activities: 3,
      totalActivities: 20
    },
    {
      id: 3,
      title: 'Social Confidence & Communication',
      progress: 30,
      activities: 6,
      totalActivities: 20
    },
    {
      id: 4,
      title: 'Purpose & Strength Discovery',
      progress: 10,
      activities: 2,
      totalActivities: 20
    },
    {
      id: 5,
      title: 'Managing Fear & Anxiety',
      progress: 5,
      activities: 1,
      totalActivities: 20
    }
  ]);
  const [challenges, setChallenges] = useState({
    completed: 12,
    total: 30,
    streak: 5
  });

  useEffect(() => {
    if (user && user.children && user.children.length > 0) {
      setActiveChild(user.children[0]);
    }
  }, [user]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const selected = user.children.find(child => child.id === childId);
    setActiveChild(selected);
  };

  const calculateOverallProgress = () => {
    if (pillars.length === 0) return 0;
    const totalProgress = pillars.reduce((sum, pillar) => sum + pillar.progress, 0);
    return Math.round(totalProgress / pillars.length);
  };

  return (
    <div className="progress-tracker-page">
      <div className="container">
        <h1>Progress Tracker</h1>
        
        {user && user.children && user.children.length > 0 ? (
          <div className="child-selector">
            <label htmlFor="childSelect">Select Child: </label>
            <select 
              id="childSelect" 
              onChange={handleChildChange}
              value={activeChild?.id}
            >
              {user.children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.age} years)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="no-children-message">
            <p>You haven't added any children to your profile yet.</p>
          </div>
        )}
        
        {activeChild && (
          <>
            <div className="dashboard-section">
              <h2>Overall Progress for {activeChild.name}</h2>
              
              <div className="overall-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateOverallProgress()}%` }}
                  ></div>
                </div>
                <p>{calculateOverallProgress()}% Complete</p>
              </div>
              
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
            
            <div className="dashboard-section">
              <h2>Progress by Pillar</h2>
              
              {pillars.map(pillar => (
                <div key={pillar.id} className="pillar-progress">
                  <h3>{pillar.title}</h3>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${pillar.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-details">
                    <p>{pillar.progress}% Complete</p>
                    <p>{pillar.activities}/{pillar.totalActivities} Activities</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="dashboard-section">
              <h2>Recent Activity</h2>
              
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-date">Mar 19</div>
                  <div className="activity-content">
                    <h4>Completed "Ask, Don't Tell" Challenge</h4>
                    <p>Independence & Problem-Solving</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-date">Mar 18</div>
                  <div className="activity-content">
                    <h4>Completed "Power of Yet" Exercise</h4>
                    <p>Growth Mindset & Resilience</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-date">Mar 17</div>
                  <div className="activity-content">
                    <h4>Completed "Conversation Challenge"</h4>
                    <p>Social Confidence & Communication</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-date">Mar 16</div>
                  <div className="activity-content">
                    <h4>Completed "Strength Journal" Entry</h4>
                    <p>Purpose & Strength Discovery</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-date">Mar 15</div>
                  <div className="activity-content">
                    <h4>Completed "Reframe the Fear" Exercise</h4>
                    <p>Managing Fear & Anxiety</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
