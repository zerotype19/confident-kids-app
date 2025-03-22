import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const API_URL = 'https://confident-kids-api.kevin-mcgovern.workers.dev';

const PillarView = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [pillar, setPillar] = useState(null);
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (user && user.children && user.children.length > 0 && !selectedChild) {
      setSelectedChild(user.children[0].id);
    }
  }, [user]);

  useEffect(() => {
    const fetchPillarData = async () => {
      if (!id || !selectedChild) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch pillar data
        const pillarResponse = await fetch(`${API_URL}/api/pillars/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!pillarResponse.ok) {
          throw new Error('Failed to fetch pillar data');
        }

        const pillarData = await pillarResponse.json();
        setPillar(pillarData);

        // Fetch techniques for this pillar
        const techniquesResponse = await fetch(`${API_URL}/api/content?pillarId=${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!techniquesResponse.ok) {
          throw new Error('Failed to fetch techniques');
        }

        const techniquesData = await techniquesResponse.json();
        setTechniques(techniquesData.filter(t => t.content_type === 'technique'));
      } catch (err) {
        console.error('Error fetching pillar data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPillarData();
  }, [id, selectedChild]);

  if (loading) {
    return <div className="container mt-4">Loading pillar data...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  if (!pillar) {
    return <div className="container mt-4">Pillar not found</div>;
  }

  return (
    <div className="container mt-4">
      <div className="child-selector mb-4">
        <label htmlFor="childSelect">Select Child:</label>
        <select 
          id="childSelect" 
          className="form-control" 
          value={selectedChild || ''} 
          onChange={(e) => setSelectedChild(e.target.value)}
        >
          {user?.children?.map(child => (
            <option key={child.id} value={child.id}>
              {child.name} ({child.age} years)
            </option>
          ))}
        </select>
      </div>

      <div className="pillar-header">
        <h1>{pillar.name}</h1>
        <p className="lead">{pillar.short_description}</p>
      </div>

      <div className="pillar-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'techniques' ? 'active' : ''}`}
          onClick={() => setActiveTab('techniques')}
        >
          Techniques
        </button>
        <button 
          className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          Challenges
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="pillar-overview">
          <div className="description">
            <h2>About This Pillar</h2>
            <p>{pillar.description}</p>
          </div>

          <div className="age-groups">
            <h2>Age-Specific Guidance</h2>
            <div className="age-group">
              <h3>Toddlers (2-5 years)</h3>
              <p>{pillar.age_groups?.toddler || 'Guidance coming soon'}</p>
            </div>
            <div className="age-group">
              <h3>Elementary (6-11 years)</h3>
              <p>{pillar.age_groups?.elementary || 'Guidance coming soon'}</p>
            </div>
            <div className="age-group">
              <h3>Teens (12+ years)</h3>
              <p>{pillar.age_groups?.teen || 'Guidance coming soon'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'techniques' && (
        <div className="pillar-techniques">
          {techniques.map(technique => (
            <div key={technique.id} className="technique-card">
              <h3>{technique.title}</h3>
              <p>{technique.description}</p>
              <div className="technique-content">
                <h4>Instructions</h4>
                <p>{technique.content_data?.instructions || 'Instructions coming soon'}</p>
                
                {technique.content_data?.examples && (
                  <>
                    <h4>Examples</h4>
                    <ul>
                      {technique.content_data.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="pillar-challenges">
          <p>Challenges for this pillar will be available soon.</p>
        </div>
      )}
    </div>
  );
};

export default PillarView;
