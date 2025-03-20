import React from 'react';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  );
};

export default NotFound;
