import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChild } from '../contexts/ChildContext';
import '../styles/ChildSelector.css';

const ChildSelector = () => {
  const { currentUser } = useAuth();
  const { activeChild, setActiveChild } = useChild();

  if (!currentUser) {
    return null;
  }

  if (!currentUser.children || currentUser.children.length === 0) {
    return (
      <div className="child-selector">
        <div className="alert alert-info">
          <p>No children added yet.</p>
          <Link to="/profile" className="btn btn-primary btn-sm mt-2">
            Add a Child
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="child-selector">
      <label htmlFor="childSelect">Select Child:</label>
      <select 
        id="childSelect" 
        className="form-control" 
        value={activeChild || ''} 
        onChange={(e) => setActiveChild(e.target.value)}
      >
        <option value="">Select a child...</option>
        {currentUser.children.map(child => (
          <option key={child.id} value={child.id}>
            {child.name} ({child.age} years)
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChildSelector; 