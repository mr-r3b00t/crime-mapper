#!/bin/bash

# Script to install the CORS proxy server from mr-r3b00t/crime-mapper on macOS
# Ensures Homebrew and npm dependencies are installed

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to print error and exit
error_exit() {
    echo -e "${RED}Error: $1${NC}" >&2
    exit 1
}

# Function to print success messages
success() {
    echo -e "${GREEN}$1${NC}"
}

# Check if running on macOS
echo "Checking operating system..."
if [[ "$(uname -s)" != "Darwin" ]]; then
    error_exit "This script is designed for macOS only."
fi
success "Confirmed running on macOS."

# Check for Homebrew and install if not present
echo "Checking for Homebrew..."
if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || error_exit "Failed to install Homebrew."
    # Add Homebrew to PATH for this session
    eval "$(/opt/homebrew/bin/brew shellenv)" || error_exit "Failed to set up Homebrew environment."
fi
success "Homebrew is installed."

# Update Homebrew
echo "Updating Homebrew..."
brew update || error_exit "Failed to update Homebrew."
success "Homebrew updated."

# Install Node.js and npm via Homebrew
echo "Checking for Node.js and npm..."
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "Installing Node.js and npm..."
    brew install node || error_exit "Failed to install Node.js and npm."
fi
success "Node.js and npm are installed."
node_version=$(node -v)
npm_version=$(npm -v)
echo "Node.js version: $node_version"
echo "npm version: $npm_version"

# Define installation directory
INSTALL_DIR="$HOME/crime-mapper-cors-proxy"
echo "Installation directory: $INSTALL_DIR"

# Remove existing directory if it exists (optional, comment out if you want to preserve it)
if [[ -d "$INSTALL_DIR" ]]; then
    echo "Existing installation found. Removing it..."
    rm -rf "$INSTALL_DIR" || error_exit "Failed to remove existing directory."
fi

# Clone the crime-mapper repository
echo "Cloning crime-mapper repository..."
git clone https://github.com/mr-r3b00t/crime-mapper.git "$INSTALL_DIR" || error_exit "Failed to clone repository."
success "Repository cloned successfully."

# Navigate to the installation directory
cd "$INSTALL_DIR" || error_exit "Failed to change to installation directory."

# Check if cors_proxy_server.js exists
if [[ ! -f "cors_proxy_server.js" ]]; then
    error_exit "cors_proxy_server.js not found in the repository."
fi

# Install npm dependencies
echo "Installing npm dependencies..."
npm install cors express || error_exit "Failed to install npm dependencies (cors, express)."
success "npm dependencies installed."

# Create a launch script for convenience
LAUNCH_SCRIPT="$INSTALL_DIR/start_cors_proxy.sh"
cat << EOF > "$LAUNCH_SCRIPT"
#!/bin/bash
cd "$INSTALL_DIR" || exit 1
node cors_proxy_server.js
EOF
chmod +x "$LAUNCH_SCRIPT" || error_exit "Failed to make launch script executable."
success "Launch script created at $LAUNCH_SCRIPT."

# Start the CORS proxy in the background
echo "Starting CORS proxy server..."
"$LAUNCH_SCRIPT" & 
CORS_PID=$!
sleep 2 # Give it a moment to start

# Check if the server is running
if ps -p $CORS_PID > /dev/null; then
    success "CORS proxy server started successfully (PID: $CORS_PID)."
    echo "You can stop it manually with: kill $CORS_PID"
else
    error_exit "CORS proxy server failed to start. Check $INSTALL_DIR for logs or errors."
fi

# Provide instructions
echo
success "Installation complete!"
echo "To start the CORS proxy manually in the future, run:"
echo "  $LAUNCH_SCRIPT"
echo "The server runs on port 8081 by default (check cors_proxy_server.js to confirm)."
echo "To use with crime-mapper, update the CORS Proxy URL in the Config tab to: http://localhost:8081"
