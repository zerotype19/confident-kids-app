import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, updateProfile, addChild } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [childFormData, setChildFormData] = useState({
    name: '',
    ageGroup: 'toddler',
    age: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);

  const { name, email } = formData;
  const { name: childName, ageGroup, age } = childFormData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChildChange = e => {
    setChildFormData({ ...childFormData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    }
  };

  const handleAddChild = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!childName || !age) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await addChild(childFormData);
      setMessage('Child added successfully');
      setChildFormData({
        name: '',
        ageGroup: 'toddler',
        age: ''
      });
    } catch (err) {
      setError('Failed to add child');
      console.error('Add child error:', err);
    }
  };

  if (!currentUser) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>User Profile</h1>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={activeTab === 'children' ? 'active' : ''} 
            onClick={() => setActiveTab('children')}
          >
            Manage Children
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Enter your email"
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {activeTab === 'children' && (
            <div className="children-tab">
              <h2>Your Children</h2>
              
              {currentUser.children && currentUser.children.length > 0 ? (
                <div className="children-list">
                  {currentUser.children.map((child, index) => (
                    <div key={index} className="child-card">
                      <h3>{child.name}</h3>
                      <p>Age: {child.age}</p>
                      <p>Age Group: {child.ageGroup}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No children added yet.</p>
              )}
              
              <h2>Add a Child</h2>
              
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleAddChild} className="add-child-form">
                <div className="form-group">
                  <label htmlFor="childName">Child's Name</label>
                  <input
                    type="text"
                    id="childName"
                    name="name"
                    value={childName}
                    onChange={onChildChange}
                    placeholder="Enter child's name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="ageGroup">Age Group</label>
                  <select
                    id="ageGroup"
                    name="ageGroup"
                    value={ageGroup}
                    onChange={onChildChange}
                    required
                  >
                    <option value="toddler">Toddler (Ages 2-5)</option>
                    <option value="elementary">Elementary (Ages 6-11)</option>
                    <option value="teen">Teen (Ages 12+)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={age}
                    onChange={onChildChange}
                    placeholder="Enter child's age"
                    min="2"
                    max="18"
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Add Child
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="profile-navigation">
          <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
