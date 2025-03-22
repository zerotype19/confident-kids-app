import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/PillarTechniques.css';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const PillarTechniques = () => {
  const { pillarId } = useParams();
  const { currentUser, loading: authLoading } = useAuth();
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.children && currentUser.children.length > 0 && !selectedChild) {
      console.log('Setting initial selected child:', currentUser.children[0].id);
      setSelectedChild(currentUser.children[0].id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchTechniques = async () => {
      if (!currentUser || !selectedChild) {
        console.log('No user or child selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/api/content/techniques/${pillarId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch techniques');
        }

        const data = await response.json();
        console.log('Fetched techniques:', data);
        setTechniques(data);
      } catch (error) {
        console.error('Error fetching techniques:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechniques();
  }, [pillarId, currentUser, selectedChild]);

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
  };

  if (authLoading || loading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">Loading techniques...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view techniques.
        </div>
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
      <div className="techniques-header mb-4">
        <h1>Confidence Techniques</h1>
        {currentUser.children && currentUser.children.length > 0 && (
          <div className="child-selector">
            <label htmlFor="childSelect">Select Child:</label>
            <select 
              id="childSelect" 
              className="form-control" 
              value={selectedChild || ''} 
              onChange={handleChildChange}
            >
              <option value="">Select a child</option>
              {currentUser.children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.age} years)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedChild ? (
        <div className="techniques-grid">
          {techniques.map(technique => (
            <div key={technique.id} className="technique-card">
              <h3>{technique.title}</h3>
              <p className="technique-description">{technique.description}</p>
              
              <div className="technique-content">
                <h4>How to Apply:</h4>
                <p>{technique.content_data?.instructions || technique.content}</p>
                
                {technique.content_data?.age_groups && (
                  <div className="age-groups">
                    <h4>Age-Specific Guidance:</h4>
                    {Object.entries(technique.content_data.age_groups).map(([age, content]) => (
                      <div key={age} className="age-group">
                        <h5>{age.charAt(0).toUpperCase() + age.slice(1)}</h5>
                        <p>{content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          Please select a child to view techniques.
        </div>
      )}
    </div>
  );
};

export default PillarTechniques; 