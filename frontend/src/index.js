import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Add this to your router definitions
router.get('/api/test', () => {
  return new Response(JSON.stringify({ message: 'API is working!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
});
