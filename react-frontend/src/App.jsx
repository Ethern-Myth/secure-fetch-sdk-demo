import React, { useState } from 'react';
import { configureSecureFetch, secureFetch } from 'secure-fetch-sdk'; 

// Initialize SDK with secret key and middleware base URL
// For Vite, use import.meta.env.VITE_; for Create React App, use process.env.REACT_APP_*
// Add VITE_ in the env before any env variables
const SHARED_SECRET = import.meta.env.VITE_SHARED_SECRET;
const MIDDLEWARE_BASE_URL = import.meta.env.VITE_MIDDLEWARE_BASE_URL;
const SECURE_DEBUG_MODE = import.meta.env.VITE_SECURE_DEBUG_MODE;

configureSecureFetch(SHARED_SECRET, `${MIDDLEWARE_BASE_URL}/secure`, SECURE_DEBUG_MODE);

export default function App() {
  const [greeting, setGreeting] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('John');

  const fetchGreeting = async () => {
    setError(null);
    setGreeting(null);
    try {
      // Original backend API path you want to call (unencrypted)
      const originalUrl = `${MIDDLEWARE_BASE_URL}/api/greet/${name}`;

      // Use secureFetch to send the request via your encrypted proxy middleware
      const response = await secureFetch(originalUrl, { method: 'GET' });

      if (!response.ok) {
        setError(`HTTP error: ${response.status}`);
        return;
      }

      const data = await response.json();
      setGreeting(data.message);
    } catch (err) {
      setError('Failed to fetch greeting');
      console.error(err);
    }
  };

  return (
    <div className='global'>
      <h2>Secure Fetch Demo</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={fetchGreeting}>Fetch Greeting</button>
      {greeting && <p>Greeting: {greeting}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
