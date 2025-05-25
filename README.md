# Example Usage for Secure Fetch SDK

A lightweight TypeScript SDK for encrypting and obfuscating API requests to protect sensitive URLs, query parameters, route IDs, and request bodies.

[![npm downloads](https://img.shields.io/npm/dm/secure-fetch-sdk)](https://www.npmjs.com/package/secure-fetch-sdk)

<br/>

[![NPM](https://nodei.co/npm/secure-fetch-sdk.png)](https://nodei.co/npm/secure-fetch-sdk/)

---

## Overview

Secure Fetch SDK helps frontend applications send encrypted requests by:

- Automatically encrypting URLs, route params, query params, and POST bodies.
- Hiding sensitive request data from browser network tabs and potential attackers.
- Supporting all HTTP methods: GET, POST, PUT, PATCH, DELETE, etc.
- Sending obfuscated URLs instead of clear text ones.
- Dispatching encrypted payload events for debugging or logging.
- Working seamlessly with a middleware that decrypts and forwards to backend APIs.

---

<video src="media/secure-fetch-video.mp4" controls></video>

## Features

- Transparent request encryption.
- Supports multiple encryption layers simultaneously (route, query, body).
- Easy integration with fetch and XMLHttpRequest.
- Emits browser events with encrypted payloads for developer tools or extensions.
- Compatible with JavaScript and TypeScript (ESM modules).
- No extra server-side changes required.
- Easy middleware as a proxy.

```javascript
For Frontend only - React, NextJs and more
import { configureSecureFetch, secureFetch } from 'secure-fetch-sdk';

-----------------

For Backend only - NodeJs Express supported currently.
import {secureProxyMiddleware, configureSecureEnv} from "secure-fetch-sdk";

```

---

## Installation

```bash
npm install secure-fetch-sdk
```

OR

```bash
yarn add secure-fetch-sdk
```

**Clone this repo and test it locally**

## Usage - Backend (Node.JS)

Usage of middleware in node.js express API:

```javascript
import express from "express";
import cors from "cors";
import {secureProxyMiddleware, configureSecureEnv} from "secure-fetch-sdk";

const app = express();
app.use(cors());

app.use('/secure', express.text({ type: 'text/plain' }), secureProxyMiddleware);

// pass it via .env not add the secret in plain text
configureSecureEnv("secret-key", true) 

app.get('/api/greet/:name', (req, res) => {
  res.json({ message: `Hello, ${req.params.name}` });
});

app.post('/api/echo', (req, res) => {
  res.json({ you_sent: req.body });
});

const port = 3000;
app.listen(port, () => console.log(`Example backend listening on port ${port}`));

```

Then run `npm run start`

### Usage in the frontend

**Rename .env.sample to .env**

```bash
VITE_SHARED_SECRET='secret-key'
VITE_MIDDLEWARE_BASE_URL=http://localhost:3000
VITE_SECURE_DEBUG_MODE=true
```

```javascript
import React, { useState } from 'react';
import { configureSecureFetch, secureFetch } from 'secure-fetch-sdk'; // Adjust path accordingly

// Initialize SDK with secret key and middleware base URL
// For Vite, use import.meta.env; for Create React App, use process.env.REACT_APP_*
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
    <div style={{ padding: 20 }}>
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

```

Then run `npm run dev `

### Middleware Integration

To decrypt and forward encrypted requests, use the accompanying middleware service:

Middleware listens for encrypted requests.

Decrypts route, query params, and body.

Forwards request to actual backend.

Returns backend response transparently.

Add this usage and route to ensure a route is called as proxy:

```javascript
app.use('/secure', express.text({ type: 'text/plain' }), secureProxyMiddleware);
```

### Configuration Options

sharedSecret (string): Secret key for symmetric encryption.

debug (boolean): Show console logs.

### Development

The SDK is written in TypeScript, compiled to ESM for modern frontend usage and node js. More information to be available soon.

.NET plugin on the way too.

### License

MIT License

#### Author

Created and Maintained by: [Ethern-Myth](https://github.com/ethern-myth)