#!/bin/bash

# Environment Setup Script for 3D Print Site
# This script helps setup environment variables for all components

set -e

echo "======================================"
echo "3D Print Site - Environment Setup"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if .env files exist
create_env_file() {
    local env_file=$1
    local env_example=$2
    
    if [ ! -f "$env_file" ]; then
        if [ -f "$env_example" ]; then
            cp "$env_example" "$env_file"
            echo -e "${GREEN}✓ Created $env_file from template${NC}"
        else
            echo -e "${YELLOW}! No template found for $env_file${NC}"
            return 1
        fi
    else
        echo -e "${BLUE}ℹ $env_file already exists${NC}"
    fi
    return 0
}

# Setup Backend Environment
echo -e "${BLUE}Setting up Backend...${NC}"
if create_env_file "backend/.env" "backend/.env.example"; then
    echo ""
    echo -e "${YELLOW}Backend Configuration:${NC}"
    echo "Location: backend/.env"
    echo "Edit values as needed:"
    echo "  - PORT: Server port (default: 5000)"
    echo "  - ADMIN_PASSWORD: Admin login password"
    echo "  - JWT_SECRET: Secret for JWT tokens"
    echo "  - NODE_ENV: Environment (development/production)"
    echo ""
fi

# Validate backend configuration
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ Backend environment file ready${NC}"
else
    echo -e "${RED}✗ Backend environment file not found${NC}"
fi

echo ""
echo "======================================"
echo ""

# Display current configuration
echo -e "${BLUE}Current Backend Configuration:${NC}"
if [ -f "backend/.env" ]; then
    grep -E "PORT|NODE_ENV|ADMIN_PASSWORD" "backend/.env" | sed 's/ADMIN_PASSWORD=.*/ADMIN_PASSWORD=***/' || echo "No configuration found"
else
    echo "No .env file found"
fi

echo ""
echo "======================================"
echo ""

# Instructions for manual changes
echo -e "${YELLOW}To customize configuration:${NC}"
echo ""
echo "1. Edit backend/.env file"
echo "2. Available options:"
echo ""
cat << 'EOF'
PORT=5000                          # Server port
ADMIN_PASSWORD=admin123            # Admin login password
NODE_ENV=development               # Environment mode
JWT_SECRET=your_secret_key         # JWT secret
MAX_FILE_SIZE=524288000           # Max upload size (bytes)
CORS_ORIGIN=*                     # CORS allowed origins
EOF

echo ""
echo "3. Save the file"
echo "4. Restart the backend server"
echo ""

# Generate Random JWT Secret if needed
echo -e "${BLUE}Generate Random JWT Secret?${NC}"
read -p "Enter 'y' to generate: " -n 1 -r generate_secret
echo ""

if [[ $generate_secret =~ ^[Yy]$ ]]; then
    SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo -e "${GREEN}Generated JWT Secret:${NC}"
    echo "$SECRET"
    echo ""
    echo "Add this to backend/.env:"
    echo "JWT_SECRET=$SECRET"
    echo ""
fi

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Environment setup complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo "Next steps:"
echo "1. Review backend/.env configuration"
echo "2. Run: cd backend && npm install"
echo "3. Run: npm run dev"
echo ""
