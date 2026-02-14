#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  3D Print Site - Full Setup Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node -v)${NC}\n"

# Function to install and run an app
setup_app() {
    local app_path=$1
    local app_name=$2
    local port=$3
    
    echo -e "${BLUE}Setting up ${app_name}...${NC}"
    
    if [ -d "$app_path" ]; then
        cd "$app_path"
        
        if [ ! -d "node_modules" ]; then
            echo "Installing dependencies..."
            npm install
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✓ Dependencies installed for ${app_name}${NC}"
            else
                echo -e "${RED}✗ Failed to install dependencies for ${app_name}${NC}"
                return 1
            fi
        else
            echo -e "${GREEN}✓ Dependencies already installed for ${app_name}${NC}"
        fi
        
        cd - > /dev/null
    else
        echo -e "${RED}✗ ${app_path} directory not found${NC}"
        return 1
    fi
    
    echo ""
    return 0
}

# Setup Backend
setup_app "./backend" "Backend" "5000"

# Setup Frontend  
setup_app "./frontend" "Frontend" "3000"

# Setup Admin
setup_app "./admin" "Admin Dashboard" "3001"

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}\n"

echo -e "${BLUE}To start the application:${NC}\n"

echo "1. Start Backend (in one terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""

echo "2. Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""

echo "3. Start Admin Dashboard (in another terminal):"
echo "   cd admin"
echo "   npm start"
echo ""

echo -e "${BLUE}Accessing the application:${NC}"
echo "  • Client: http://localhost:3000"
echo "  • Admin:  http://localhost:3001"
echo "  • API:    http://localhost:5000"
echo ""

echo -e "${BLUE}Default Admin Password: admin123${NC}"
echo -e "${BLUE}(Change this in backend/.env file)${NC}\n"
