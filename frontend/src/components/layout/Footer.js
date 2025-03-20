import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Confident Kids. All rights reserved.</p>
        <p>A research-backed approach to building confidence, resilience and purpose in children.</p>
      </div>
    </footer>
  );
};

export default Footer;
