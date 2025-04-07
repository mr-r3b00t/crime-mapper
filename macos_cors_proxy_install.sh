#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Starting proxy server installation..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo -e "${RED}Homebrew not found. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo -e "${GREEN}Homebrew already installed${NC}"
    # Update Homebrew
    brew update
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Installing Node.js...${NC}"
    brew install node
else
    echo -e "${GREEN}Node.js already installed${NC}"
    # Update Node.js to latest version
    brew upgrade node
fi

# Create project directory
PROJECT_DIR="$HOME/proxy-server"
if [ ! -d "$PROJECT_DIR" ]; then
    mkdir "$PROJECT_DIR"
    echo "Created project directory at $PROJECT_DIR"
else
    echo "Project directory already exists at $PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# Initialize npm project if package.json doesn't exist
if [ ! -f "package.json" ]; then
    npm init -y
    echo "Initialized npm project"
fi

# Install required dependencies
echo "Installing dependencies..."
npm install express axios cors

# Create the proxy server file
cat > proxy.js << 'EOF'
const express = require('express');
const axios = require('axios');
const https = require('https');
const url = require('url');
const cors = require('cors');
const app = express();
const port = 3000;

const allowList = [
  'api.shodan.io',
  'ipinfo.io',
  'dns.google.com',
  'api.hudsonrock.com',
  'cavalier.hudsonrock.com',
  'internetdb.shodan.io'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === 'null' || origin === 'http://localhost:3000') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}));

const checkAllowList = (req, res, next) => {
  let targetUrl = req.query.url;
  if (!targetUrl) {
    console.log('Request rejected: No URL provided');
    return res.status(400).send('No URL provided');
  }

  targetUrl = targetUrl.replace(/^\/+/, '');

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
EOF

echo -e "${GREEN}Installation complete!${NC}"
echo "To start the proxy server:"
echo "1. cd $PROJECT_DIR"
echo "2. node proxy.js"
echo ""
echo "The proxy will be available at http://localhost:3000"
echo "You can test it with:"
echo "curl 'http://localhost:3000/proxy?url=https://api.shodan.io/ip/8.8.8.8'"
