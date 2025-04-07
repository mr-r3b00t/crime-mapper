#!/bin/bash

# install.sh - Setup script for macOS to install dependencies for the proxy server

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Starting installation of proxy server dependencies..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH (for new installations)
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
    eval "$(/opt/homebrew/bin/brew shellenv)"
else
    echo "Homebrew already installed. Updating..."
    brew update
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js and npm..."
    brew install node
else
    echo "Node.js already installed. Version: $(node --version)"
fi

# Check if npm is installed (should come with Node.js)
if ! command -v npm &> /dev/null; then
    echo "${RED}Error: npm not found after Node.js install${NC}"
    exit 1
fi

# Create package.json if it doesn't exist
if [ ! -f package.json ]; then
    echo "Creating package.json..."
    cat > package.json << EOL
{
  "name": "cors-proxy",
  "version": "1.0.0",
  "description": "CORS Proxy Server",
  "main": "index.js",
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "cors": "^2.8.5"
  },
  "scripts": {
    "start": "node index.js"
  }
}
EOL
fi

# Install npm dependencies
echo "Installing npm dependencies..."
npm install express axios cors

echo -e "${GREEN}Installation completed successfully!${NC}"
echo "To run the proxy server:"
echo "1. Save your server code as 'index.js'"
echo "2. Run 'npm start' or 'node index.js'"
echo "The proxy will be available at http://localhost:3000/proxy?url=<target-url>"
