import React, { useState, useEffect } from 'react';
import { FaUser, FaCog, FaBell, FaLock, FaCreditCard, FaChild, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [newChild, setNewChild] = useState({
    name: '',
    age: '',
    age_group: ''
  });
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const { currentUser, updateProfile } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.user || data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile.user || updatedProfile);
      
      // Update the user in AuthContext
      await updateProfile(updatedProfile.user || updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Determine age group based on age
      let ageGroup;
      if (newChild.age >= 2 && newChild.age <= 5) {
        ageGroup = 'Toddler';
      } else if (newChild.age >= 6 && newChild.age <= 12) {
        ageGroup = 'Elementary';
      } else if (newChild.age >= 13 && newChild.age <= 18) {
        ageGroup = 'Teen';
      } else {
        throw new Error('Age must be between 2 and 18');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newChild,
          ageGroup
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add child');
      }

      const data = await response.json();
      
      // Fetch updated profile data
      const profileResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch updated profile');
      }

      const profileData = await profileResponse.json();
      setProfile(profileData.user || profileData);
      setNewChild({ name: '', age: '' });
      setShowAddChildForm(false);
    } catch (error) {
      console.error('Error adding child:', error);
      setError(error.message);
    }
  };

  const handleEditChild = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Determine age group based on age
      let ageGroup;
      if (editingChild.age >= 2 && editingChild.age <= 5) {
        ageGroup = 'Toddler';
      } else if (editingChild.age >= 6 && editingChild.age <= 12) {
        ageGroup = 'Elementary';
      } else if (editingChild.age >= 13 && editingChild.age <= 18) {
        ageGroup = 'Teen';
      } else {
        throw new Error('Age must be between 2 and 18');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/children/${editingChild.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editingChild,
          ageGroup
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update child');
      }

      // Fetch updated profile data
      const profileResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch updated profile');
      }

      const profileData = await profileResponse.json();
      setProfile(profileData.user || profileData);
      setEditingChild(null);
    } catch (error) {
      console.error('Error updating child:', error);
      setError(error.message);
    }
  };

  const handleDeleteChild = async (childId) => {
    if (!window.confirm('Are you sure you want to delete this child?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/children/${childId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete child');
      }

      // Fetch updated profile data
      const profileResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch updated profile');
      }

      const profileData = await profileResponse.json();
      setProfile(profileData.user || profileData);
    } catch (error) {
      console.error('Error deleting child:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div className="no-profile">No profile data available</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>

        <nav className="profile-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          <button 
            className={`nav-item ${activeTab === 'children' ? 'active' : ''}`}
            onClick={() => setActiveTab('children')}
          >
            <FaChild /> Children
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock /> Security
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h3>Profile Information</h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'children' && (
          <div className="children-section">
            <h3>My Children</h3>
            
            {profile.children && profile.children.length > 0 ? (
              <div className="children-grid">
                {profile.children.map(child => (
                  <div key={child.id} className="child-card">
                    <div className="child-avatar">
                      <FaChild />
                    </div>
                    <div className="child-info">
                      <h4>{child.name}</h4>
                      <p>{child.age} years old</p>
                      <p className="age-group">{child.age_group}</p>
                    </div>
                    <div className="child-actions">
                      <button 
                        className="btn btn-icon"
                        onClick={() => setEditingChild(child)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-icon btn-danger"
                        onClick={() => handleDeleteChild(child.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>You haven't added any children yet.</p>
            )}

            <button 
              className="btn btn-secondary mt-4"
              onClick={() => setShowAddChildForm(!showAddChildForm)}
            >
              <FaPlus className="me-2" /> Add Child
            </button>

            {showAddChildForm && (
              <form onSubmit={handleAddChild} className="add-child-form mt-4">
                <div className="form-group">
                  <label>Child's Name</label>
                  <input
                    type="text"
                    value={newChild.name}
                    onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    min="2"
                    max="18"
                    value={newChild.age}
                    onChange={(e) => setNewChild({ ...newChild, age: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Add Child
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary ms-2"
                    onClick={() => setShowAddChildForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {editingChild && (
              <form onSubmit={handleEditChild} className="add-child-form mt-4">
                <h4>Edit Child</h4>
                <div className="form-group">
                  <label>Child's Name</label>
                  <input
                    type="text"
                    value={editingChild.name}
                    onChange={(e) => setEditingChild({ ...editingChild, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    min="2"
                    max="18"
                    value={editingChild.age}
                    onChange={(e) => setEditingChild({ ...editingChild, age: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditingChild(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h3>Account Settings</h3>
            <div className="settings-grid">
              <div className="setting-card">
                <h4>Language</h4>
                <select value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div className="setting-card">
                <h4>Theme</h4>
                <select value={profile.theme} onChange={(e) => setProfile({ ...profile, theme: e.target.value })}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-section">
            <h3>Security Settings</h3>
            <div className="security-options">
              <button className="btn btn-secondary">
                Change Password
              </button>
              <button className="btn btn-secondary">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
