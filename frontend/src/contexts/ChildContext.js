import React, { createContext, useContext, useState, useEffect } from 'react';

const ChildContext = createContext();

export const useChild = () => {
  return useContext(ChildContext);
};

export const ChildProvider = ({ children }) => {
  const [activeChild, setActiveChild] = useState(null);

  // Load active child from localStorage on mount
  useEffect(() => {
    const savedChildId = localStorage.getItem('activeChildId');
    if (savedChildId) {
      setActiveChild(savedChildId);
    }
  }, []);

  // Save active child to localStorage whenever it changes
  useEffect(() => {
    if (activeChild) {
      localStorage.setItem('activeChildId', activeChild);
    } else {
      localStorage.removeItem('activeChildId');
    }
  }, [activeChild]);

  const value = {
    activeChild,
    setActiveChild,
  };

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
}; 