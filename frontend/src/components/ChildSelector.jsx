import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChild } from '../contexts/ChildContext';
import '../styles/ChildSelector.css';

const ChildSelector = () => {
  const { currentUser } = useAuth();
  const { activeChild, setActiveChild } = useChild();

  if (!currentUser || !currentUser.children || currentUser.children.length === 0) {
    return null;
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