import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaStar, FaClock, FaUserFriends } from 'react-icons/fa';
import '../styles/PillarTechniques.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const PillarTechniques = () => {
  const { pillarId } = useParams();
  const { currentUser } = useAuth();
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.children && currentUser.children.length > 0 && !selectedChild) {
      setSelectedChild(currentUser.children[0].id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchTechniques = async () => {
      if (!currentUser || !selectedChild) return;

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/api/pillars/${pillarId}/techniques?childId=${selectedChild}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch techniques');
        }

        const data = await response.json();
        setTechniques(data.techniques || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechniques();
  }, [pillarId, currentUser, selectedChild]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    setSelectedChild(childId);
  };

  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view techniques.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Loading techniques...</div>
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
          value={selectedChild || ''} 
          onChange={handleChildChange}
        >
          {currentUser.children.map(child => (
            <option key={child.id} value={child.id}>
              {child.name} ({child.age} years)
            </option>
          ))}
        </select>
      </div>

      <div className="techniques-grid">
        {techniques.map(technique => (
          <div key={technique.id} className="technique-card">
            <h3>{technique.title}</h3>
            <div className="technique-meta">
              <span className="difficulty">
                <FaStar /> {technique.difficulty_level === 1 ? 'Easy' : 
                           technique.difficulty_level === 2 ? 'Medium' : 'Hard'}
              </span>
              <span className="duration">
                <FaClock /> {technique.duration} minutes
              </span>
              <span className="age-range">
                <FaUserFriends /> {technique.age_group === 'all' ? 'All Ages' : technique.age_group}
              </span>
            </div>
            <p>{technique.description}</p>
            <div className="technique-steps">
              <h4>Steps:</h4>
              <ol>
                {technique.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
            {technique.tips && (
              <div className="technique-tips">
                <h4>Tips:</h4>
                <ul>
                  {technique.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PillarTechniques; 