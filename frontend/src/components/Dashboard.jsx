import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaChartLine, FaCalendarAlt, FaTrophy, FaCrown } from 'react-icons/fa';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, hasPremiumAccess } = useAuth();
  const isPremium = hasPremiumAccess();

  useEffect(() => {
    console.log('Dashboard: currentUser changed', currentUser);
  }, [currentUser]);

  useEffect(() => {
    // Set the first child as selected by default if user has children
    if (currentUser?.children?.length > 0 && !selectedChild) {
      console.log('Dashboard: Setting initial child', currentUser.children[0]);
      setSelectedChild(currentUser.children[0].id);
    }
  }, [currentUser, selectedChild]);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Only include childId in the URL if a child is selected
        const url = selectedChild 
          ? `${process.env.REACT_APP_API_URL}/api/dashboard?childId=${selectedChild}`
          : `${process.env.REACT_APP_API_URL}/api/dashboard`;
        
        console.log('Dashboard: Fetching data for child:', selectedChild || 'no child selected');
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Dashboard: Received data:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch dashboard data');
        }

        if (mounted) {
          setDashboardData(data);
          // Log the daily challenge status
          if (data.todayChallenge) {
            console.log('Daily challenge status:', {
              childId: selectedChild,
              challengeId: data.todayChallenge.id,
              completed: data.todayChallenge.completed
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (mounted) {
          setError(`Failed to load dashboard data${selectedChild ? ` for selected child` : ''}. Please try again later.`);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, [selectedChild]);

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
  };

  if (loading) {
    return <div className="text-center p-5">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="text-center p-5">No dashboard data available.</div>;
  }

  // If we have dashboard data but no currentUser, show a basic view
  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="dashboard-welcome">
          <h1>Welcome!</h1>
          <p>Track your child's confidence journey and explore activities designed to build their confidence.</p>
        </div>
        
        <div className="alert alert-info mt-4">
          <h4>Let's Get Started!</h4>
          <p>Add your child's profile to begin their confidence journey.</p>
          <Link to="/profile" className="btn btn-primary mt-2">
            Add Child Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="dashboard-welcome">
        <h1>Welcome, {currentUser.name}!</h1>
        <p>Track your child's confidence journey and explore activities designed to build their confidence.</p>
      </div>
      
      {currentUser.children && currentUser.children.length > 0 ? (
        <>
          <div className="child-selector mb-4">
            <label htmlFor="childSelect">Select Child:</label>
            <select 
              id="childSelect" 
              className="form-control" 
              value={selectedChild} 
              onChange={handleChildChange}
            >
              {currentUser.children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.age} years)
                </option>
              ))}
            </select>
          </div>
          
          {selectedChild ? (
            <>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <FaChartLine className="mb-2" size={24} />
                  <div className="stat-value">{dashboardData.overallProgress}%</div>
                  <div className="stat-label">Overall Progress</div>
                </div>
                
                <div className="stat-card">
                  <FaCalendarAlt className="mb-2" size={24} />
                  <div className="stat-value">{dashboardData.activitiesCompleted}</div>
                  <div className="stat-label">Activities Completed</div>
                </div>
                
                <div className="stat-card">
                  <FaTrophy className="mb-2" size={24} />
                  <div className="stat-value">{isPremium ? dashboardData.points : 'Locked'}</div>
                  <div className="stat-label">Reward Points {!isPremium && <span className="premium-badge">PRO</span>}</div>
                </div>
              </div>
              
              <div className="today-challenge">
                <h2>Today's Challenge</h2>
                <div className="challenge-container">
                  <h3 className="challenge-title">{dashboardData.todayChallenge.title}</h3>
                  <p className="challenge-description">{dashboardData.todayChallenge.description}</p>
                  {dashboardData.todayChallenge.completed ? (
                    <div className="completed-message">
                      <span className="completed-badge">Completed</span>
                      <p>Great job! Come back tomorrow for a new challenge.</p>
                      <Link to="/challenges" className="btn btn-secondary mt-3">
                        View All Challenges
                      </Link>
                    </div>
                  ) : (
                    <Link to={`/challenges/${dashboardData.todayChallenge.id}`} className="btn btn-primary mt-3">
                      Start Challenge
                    </Link>
                  )}
                </div>
              </div>
              
              <h2 className="mt-5 mb-3">Confidence Pillars</h2>
              <div className="grid-3">
                {dashboardData.pillars.map((pillar) => (
                  <div key={pillar.id} className={`pillar-card pillar-card-${pillar.id}`}>
                    <div className="pillar-card-header">
                      <h3>{pillar.name}</h3>
                    </div>
                    <div className="pillar-card-body">
                      <p>{pillar.shortDescription}</p>
                      <div className="progress-label">
                        <span>Progress</span>
                        <span>{pillar.progress}%</span>
                      </div>
                      <div className="progress-container">
                        <div 
                          className={`progress-bar progress-bar-${pillar.id}`} 
                          style={{ width: `${pillar.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="pillar-card-footer">
                      <span>{pillar.activitiesCompleted}/{pillar.totalActivities} Activities</span>
                      <Link to={`/pillars/${pillar.id}`} className="btn btn-sm btn-outline">
                        Explore
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="alert alert-info mt-4">
              <h4>Select a Child</h4>
              <p>Please select a child from the dropdown above to view their dashboard.</p>
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-info mt-4">
          <h4>Let's Get Started!</h4>
          <p>Add your child's profile to begin their confidence journey.</p>
          <Link to="/profile" className="btn btn-primary mt-2">
            Add Child Profile
          </Link>
        </div>
      )}
      
      {!isPremium && (
        <div className="upgrade-prompt standard mt-5">
          <h3><FaCrown className="me-2" /> Unlock Premium Features</h3>
          <p>Subscribe to our premium plan to access all activities, detailed progress tracking, and rewards for your child.</p>
          <Link to="/subscription" className="upgrade-button">Upgrade Now</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
