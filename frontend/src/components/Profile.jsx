import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaChild, FaPlus, FaEdit, FaTrash, FaCreditCard } from 'react-icons/fa';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [children, setChildren] = useState([]);
  const [newChild, setNewChild] = useState({ name: '', age: '', ageGroup: 'elementary' });
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { currentUser, updateProfile, userSubscription, fetchSubscriptionStatus } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setChildren(currentUser.children || []);
    }
    
    if (userSubscription) {
      setSubscriptionDetails(userSubscription);
    }
  }, [currentUser, userSubscription]);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const userData = {
        name,
        email,
        ...(password ? { password } : {})
      };
      
      await updateProfile(userData);
      setSuccess('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddChild = async (e) => {
    e.preventDefault();
    
    if (!newChild.name || !newChild.age || !newChild.ageGroup) {
      return setError('Please provide name, age, and age group');
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newChild),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add child');
      }
      
      // Update children list
      setChildren([...children, data.child]);
      setNewChild({ name: '', age: '', ageGroup: 'elementary' });
      setSuccess('Child added successfully');
    } catch (error) {
      setError(error.message || 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditChild = async (childId, updatedData) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/children/${childId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update child');
      }
      
      // Update children list
      setChildren(children.map(child => 
        child.id === childId ? { ...child, ...updatedData } : child
      ));
      setSuccess('Child updated successfully');
    } catch (error) {
      setError(error.message || 'Failed to update child');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteChild = async (childId) => {
    if (!window.confirm('Are you sure you want to delete this child profile? This action cannot be undone.')) {
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/children/${childId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete child');
      }
      
      // Update children list
      setChildren(children.filter(child => child.id !== childId));
      setSuccess('Child deleted successfully');
    } catch (error) {
      setError(error.message || 'Failed to delete child');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }
      
      // Refresh subscription status
      await fetchSubscriptionStatus();
      setSuccess('Subscription cancelled successfully');
    } catch (error) {
      setError(error.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Your Profile</h1>
      
      <div className="profile-tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser className="me-2" /> Profile
        </button>
        <button 
          className={activeTab === 'children' ? 'active' : ''}
          onClick={() => setActiveTab('children')}
        >
          <FaChild className="me-2" /> Children
        </button>
        <button 
          className={activeTab === 'subscription' ? 'active' : ''}
          onClick={() => setActiveTab('subscription')}
        >
          <FaCreditCard className="me-2" /> Subscription
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div className="profile-form">
          <h2 className="mb-4">Account Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group mb-3">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <h3 className="mt-4 mb-3">Change Password</h3>
            <p className="text-muted mb-3">Leave blank to keep your current password</p>
            
            <div className="form-group mb-3">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="form-group mb-4">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'children' && (
        <div>
          <div className="children-list">
            <h2 className="mb-4">Your Children</h2>
            
            {children.length === 0 ? (
              <p>You haven't added any children yet. Add a child to get started.</p>
            ) : (
              children.map((child) => (
                <div key={child.id} className="child-item">
                  <div className="child-info">
                    <div className="child-name">{child.name}</div>
                    <div className="child-age">{child.age} years old</div>
                  </div>
                  <div className="child-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        const updatedName = prompt('Enter new name:', child.name);
                        const updatedAge = prompt('Enter new age:', child.age);
                        if (updatedName && updatedAge) {
                          handleEditChild(child.id, { name: updatedName, age: updatedAge });
                        }
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteChild(child.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="profile-form mt-4">
            <h3 className="mb-3">Add a Child</h3>
            <form onSubmit={handleAddChild}>
              <div className="form-group mb-3">
                <label htmlFor="childName">Child's Name</label>
                <input
                  type="text"
                  id="childName"
                  className="form-control"
                  value={newChild.name}
                  onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="childAge">Child's Age</label>
                <input
                  type="number"
                  id="childAge"
                  className="form-control"
                  min="1"
                  max="18"
                  value={newChild.age}
                  onChange={(e) => setNewChild({ ...newChild, age: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="childAgeGroup">Age Group</label>
                <select
                  id="childAgeGroup"
                  className="form-control"
                  value={newChild.ageGroup}
                  onChange={(e) => setNewChild({ ...newChild, ageGroup: e.target.value })}
                  required
                >
                  <option value="toddler">Toddler (2-4)</option>
                  <option value="elementary">Elementary (5-10)</option>
                  <option value="teen">Teen (11-18)</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <FaPlus className="me-2" /> Add Child
              </button>
            </form>
          </div>
        </div>
      )}
      
      {activeTab === 'subscription' && (
        <div className="profile-form">
          <h2 className="mb-4">Subscription Details</h2>
          
          {subscriptionDetails && subscriptionDetails.status === 'active' ? (
            <div>
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="text-primary mb-3">Premium Subscription</h3>
                  <p><strong>Status:</strong> Active</p>
                  <p><strong>Plan:</strong> {subscriptionDetails.plan === 'yearly' ? 'Annual' : subscriptionDetails.plan === 'monthly' ? 'Monthly' : 'Lifetime'}</p>
                  {subscriptionDetails.current_period_end && (
                    <p><strong>Next billing date:</strong> {new Date(subscriptionDetails.current_period_end * 1000).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              
              <button
                className="btn btn-danger"
                onClick={handleCancelSubscription}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Cancel Subscription'}
              </button>
              <p className="text-muted mt-2">
                Your subscription will remain active until the end of your current billing period.
              </p>
            </div>
          ) : (
            <div>
              <div className="alert alert-info">
                <p>You don't have an active subscription.</p>
                <p>Upgrade to Premium to unlock all features and activities.</p>
              </div>
              
              <a href="/subscription" className="btn btn-primary">
                View Subscription Options
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
