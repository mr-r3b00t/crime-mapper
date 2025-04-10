const express = require('express');
const axios = require('axios');
const https = require('https');
const url = require('url');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = 3000;

// Allowed target domains
const allowList = [
  'api.shodan.io',
  'ipinfo.io',
  'safebrowsing.googleapis.com',
  'dns.google.com',
  'api.hudsonrock.com',
  'cavalier.hudsonrock.com',
  'internetdb.shodan.io',
  'api.greynoise.io',
  'urlscan.io',
  'proxy',
  'api.securitytrails.com',
  'urlhaus-api.abuse.ch',
  'api.any.run'
];

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowed = !origin || origin === 'null' || origin === 'http://localhost:3000';
    if (allowed) {
      callback(null, true);
    } else {
      console.log(`CORS rejected origin: ${origin}`);
      callback(new Error('Origin not allowed by CORS policy'));
    }
  },
  optionsSuccessStatus: 200
}));

// Middleware to validate and sanitize target URL with full request logging
function validateTargetUrl(req, res, next) {
  console.log('Full Request Details:', {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  const targetUrlRaw = req.query.url || req.body.url;
  if (!targetUrlRaw) {
    console.log('Request rejected: No target URL provided');
    return res.status(400).json({ error: 'No target URL provided' });
  }

  let targetUrl = targetUrlRaw.replace(/^\/+/, '');
  if (!targetUrl.match(/^https?:\/\//)) {
    targetUrl = `https://${targetUrl}`;
  }

  let parsedUrl;
  try {
    parsedUrl = new url.URL(targetUrl);
  } catch (error) {
    console.log(`Request rejected: Invalid URL format - ${targetUrl}`);
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const hostname = parsedUrl.hostname;
  if (!allowList.includes(hostname)) {
    console.log(`Request rejected: Domain not allowed - ${hostname}`);
    return res.status(403).json({ error: 'Target domain not in allow list' });
  }

  req.targetUrl = targetUrl;
  console.log(`Request validated: ${targetUrl} (${req.method})`);
  next();
}

// Proxy handler function with POST response logging
async function proxyRequest(req, res) {
  try {
    const axiosConfig = {
      method: req.method.toLowerCase(),
      url: req.targetUrl,
      headers: {
        'User-Agent': 'cors-proxy/1.0',
        'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    };

    if (req.method === 'POST' && req.body) {
      axiosConfig.data = req.body;
    }

    // Forward specific headers including 'Auth-Key'
    ['api-key', 'key', 'apikey', 'Auth-Key'].forEach(header => {
      if (req.headers[header.toLowerCase()]) { // Case-insensitive header matching
        axiosConfig.headers[header] = req.headers[header.toLowerCase()];
      }
    });

    // Forward 'Accept' header if present, default to 'application/json'
    axiosConfig.headers['Accept'] = req.headers['accept'] || 'application/json';

    const response = await axios(axiosConfig);
    
    // Log POST response details
    if (req.method === 'POST') {
      console.log(`POST Response from ${req.targetUrl}:`, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`Response from ${req.targetUrl}: ${response.status}`);
    }

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(`Proxy error for ${req.targetUrl}:`, error);
    if (error.response) {
      // Log error response details for POST requests
      if (req.method === 'POST') {
        console.log(`POST Error Response from ${req.targetUrl}:`, {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
          timestamp: new Date().toISOString()
        });
      }
      res.status(error.response.status).json({
        error: 'Proxy request failed',
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
        request: {
          url: req.targetUrl,
          method: req.method
        }
      });
    } else {
      res.status(500).json({
        error: 'Proxy error',
        message: error.message,
        stack: error.stack,
        request: {
          url: req.targetUrl,
          method: req.method
        }
      });
    }
  }
}

// Proxy endpoint
app.all('/proxy', validateTargetUrl, proxyRequest);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Server error:`, err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    stack: err.stack,
    request: {
      url: req.originalUrl,
      method: req.method,
      headers: req.headers,
      body: req.body
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`CORS Proxy Server running on http://localhost:${port}`);
  console.log('Usage:');
  console.log('  GET:  http://localhost:3000/proxy?url=<target-url>');
  console.log('  POST: http://localhost:3000/proxy with body { "url": "<target-url>" } or form data');
  console.log('Example (URLhaus POST):');
  console.log(`  curl -X POST http://localhost:${port}/proxy -H "Auth-Key: YOUR-AUTH-KEY-HERE" -d "url=https://example.com"`);
  console.log('Allowed domains:', allowList.join(', '));
});
