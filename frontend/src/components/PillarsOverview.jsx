import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useChild } from '../contexts/ChildContext';
import ChildSelector from './ChildSelector';
import '../styles/PillarsOverview.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const PillarsOverview = () => {
  const { currentUser, loading } = useAuth();
  const { activeChild } = useChild();
  const [pillars, setPillars] = useState([]);
  const [content, setContent] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [componentLoading, setComponentLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        console.log('No user found');
        setComponentLoading(false);
        return;
      }

      if (!currentUser.children || currentUser.children.length === 0) {
        console.log('User has no children');
        setComponentLoading(false);
        return;
      }

      if (!activeChild) {
        console.log('No child selected');
        setComponentLoading(false);
        return;
      }

      try {
        setComponentLoading(true);
        const token = localStorage.getItem('authToken');
        console.log('Fetching data with token:', token ? 'Token exists' : 'No token');
        console.log('Selected child:', activeChild);
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Fetch pillars with child progress
        const pillarsResponse = await fetch(`${API_URL}/api/pillars?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!pillarsResponse.ok) {
          const errorData = await pillarsResponse.json();
          console.error('Pillars response error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch pillars data');
        }
        
        // Fetch content (techniques)
        const contentResponse = await fetch(`${API_URL}/api/content`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!contentResponse.ok) {
          const errorData = await contentResponse.json();
          console.error('Content response error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch content data');
        }
        
        // Fetch challenges
        const challengesResponse = await fetch(`${API_URL}/api/challenges?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!challengesResponse.ok) {
          const errorData = await challengesResponse.json();
          console.error('Challenges response error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch challenges data');
        }
        
        // Fetch achievements
        const achievementsResponse = await fetch(`${API_URL}/api/achievements?childId=${activeChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!achievementsResponse.ok) {
          const errorData = await achievementsResponse.json();
          console.error('Achievements response error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch achievements data');
        }
        
        const [pillarsData, contentData, challengesData, achievementsData] = await Promise.all([
          pillarsResponse.json(),
          contentResponse.json(),
          challengesResponse.json(),
          achievementsResponse.json()
        ]);
        
        setPillars(pillarsData || []);
        setContent(contentData || []);
        setChallenges(challengesData || []);
        setAchievements(achievementsData || []);
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setComponentLoading(false);
      }
    };

    fetchData();
  }, [currentUser, activeChild]);

  if (loading || componentLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Loading pillars data...</div>
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

  if (!currentUser || !currentUser.children || currentUser.children.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please add a child to your profile to view pillars and progress.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ChildSelector />

      <div className="pillars-grid">
        {pillars.map(pillar => (
          <div key={pillar.id} className="pillar-card">
            <h3>{pillar.name}</h3>
            <div className="pillar-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${pillar.progress || 0}%` }}
              ></div>
              <span className="progress-text">{pillar.progress || 0}%</span>
            </div>
            <p>{pillar.short_description}</p>
            <Link 
              to={`/pillars/${pillar.id}`} 
              className="btn btn-primary"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PillarsOverview; 