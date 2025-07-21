#!/bin/bash

# OSINT SAAS Deployment Script
echo "Starting OSINT SAAS deployment..."

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Python 3 and pip
apt install -y python3 python3-pip python3-venv

# Install nginx
apt install -y nginx

# Install PM2 for process management
npm install -g pm2

# Create application directory
mkdir -p /var/www/insan-osint-saas
cd /var/www/insan-osint-saas

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

echo "Basic setup completed. Now transfer your application files to /var/www/insan-osint-saas/"
echo "Then run: ./setup-app.sh" 