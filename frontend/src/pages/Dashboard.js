import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeChild, setActiveChild] = useState(null);
  const [pillars, setPillars] = useState([
    {
      id: 1,
      title: 'Independence & Problem-Solving',
      description: 'Help your child develop independence and problem-solving skills.',
      progress: 20
    },
    {
      id: 2,
      title: 'Growth Mindset & Resilience',
      description: 'Foster a growth mindset and resilience in your child.',
      progress: 15
    },
    {
      id: 3,
      title: 'Social Confidence & Communication',
      description: 'Build social confidence and communication skills.',
      progress: 30
    },
    {
      id: 4,
      title: 'Purpose & Strength Discovery',
      description: 'Help your child discover their purpose and strengths.',
      progress: 10
    },
    {
      id: 5,
      title: 'Managing Fear & Anxiety',
      description: 'Help your child manage fear and anxiety.',
      progress: 5
    }
  ]);
  const [dailyChallenge, setDailyChallenge] = useState({
    title: 'Ask, Don\'t Tell Challenge',
    description: 'When your child asks for help today, respond with a question that helps them solve the problem themselves.',
    completed: false
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

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Dashboard</h1>
        
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
            <Link to="/profile" className="btn btn-primary">
              Add a Child
            </Link>
          </div>
        )}
        
        {activeChild && (
          <>
            <div className="dashboard-section">
              <h2>Welcome, {user.name}!</h2>
              <p>You're currently viewing content for {activeChild.name} (Age: {activeChild.age})</p>
              
              <div className="overall-progress">
                <h3>Overall Confidence Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '15%' }}
                  ></div>
                </div>
                <p>15% Complete</p>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2>The 5 Pillars of Confidence</h2>
              <p>Focus on one pillar per month for best results.</p>
              
              <div className="pillars-grid">
                {pillars.map(pillar => (
                  <Link 
                    to={`/pillar/${pillar.id}`} 
                    key={pillar.id} 
                    className="pillar-card"
                  >
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${pillar.progress}%` }}
                      ></div>
                    </div>
                    <p>{pillar.progress}% Complete</p>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2>Today's Challenge</h2>
              <div className="challenge-card">
                <h3>{dailyChallenge.title}</h3>
                <p>{dailyChallenge.description}</p>
                {dailyChallenge.completed ? (
                  <span className="completed-badge">Completed</span>
                ) : (
                  <button className="btn btn-primary">
                    Mark as Complete
                  </button>
                )}
              </div>
              <div className="challenge-links">
                <Link to="/challenges" className="btn btn-secondary">
                  View All Challenges
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
