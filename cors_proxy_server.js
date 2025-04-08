const express = require('express');
const axios = require('axios');
const https = require('https');
const url = require('url');
const cors = require('cors'); // Add CORS package
const app = express();
const port = 3000;

const allowList = [
  'api.shodan.io',
  'ipinfo.io',
  'dns.google.com',
  'api.hudsonrock.com',
  'cavalier.hudsonrock.com',
  'internetdb.shodan.io',
  'api.greynoise.io'
];

// Configure CORS to allow specific origins, including null
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like local files or mobile apps) or from allowed origins
    if (!origin || origin === 'null' || origin === 'http://localhost:3000') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // For legacy browsers
}));

// Middleware to check if the requested domain is in the allow list
const checkAllowList = (req, res, next) => {
  let targetUrl = req.query.url;
  if (!targetUrl) {
    console.log('Request rejected: No URL provided');
    return res.status(400).send('No URL provided');
  }

  // Remove leading slashes if present
  targetUrl = targetUrl.replace(/^\/+/, '');

  // Parse the URL to extract the hostname
  let hostname;
  try {
    hostname = new url.URL(targetUrl).hostname;
  } catch (error) {
    console.log(`Request rejected: Invalid URL - ${targetUrl}`);
    return res.status(400).send('Invalid URL');
  }

  const isAllowed = allowList.some(allowed => hostname === allowed);
  if (!isAllowed) {
    console.log(`Request rejected: Target domain not in allow list - ${hostname}`);
    return res.status(403).send('Target domain not in allow list');
  }

  req.sanitizedUrl = targetUrl;
  console.log(`Request received: ${targetUrl}`);
  next();
};

// Proxy endpoint
app.get('/proxy', checkAllowList, async (req, res) => {
  try {
    const response = await axios.get(req.sanitizedUrl, {
      headers: {
        'User-Agent': 'cors-proxy/1.0'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    console.log('Response received:', response.data);
    res.send(response.data);
  } catch (error) {
    console.error(`Error fetching data for ${req.sanitizedUrl}: ${error.message}`);
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
  console.log('To use the proxy, set your proxy URL to:');
  console.log(`http://localhost:${port}/proxy?url=<target-url>`);
  console.log('Example:');
  console.log(`http://localhost:${port}/proxy?url=https://api.shodan.io/ip/8.8.8.8`);
  console.log('Allowed domains:', allowList.join(', '));
});
