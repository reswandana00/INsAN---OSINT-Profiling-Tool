#!/bin/bash

# Application Setup Script
cd /var/www/insan-osint-saas

# Install Python dependencies
source venv/bin/activate
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Build Next.js application
npm run build

# Create systemd service for backend
cat > /etc/systemd/system/insan-backend.service << EOF
[Unit]
Description=INSAN OSINT Backend
After=network.target

[Service]
Type=exec
User=root
WorkingDirectory=/var/www/insan-osint-saas/app/api
Environment=PATH=/var/www/insan-osint-saas/venv/bin
ExecStart=/var/www/insan-osint-saas/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for frontend
cat > /etc/systemd/system/insan-frontend.service << EOF
[Unit]
Description=INSAN OSINT Frontend
After=network.target

[Service]
Type=exec
User=root
WorkingDirectory=/var/www/insan-osint-saas
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Configure nginx
cat > /etc/nginx/sites-available/insan-osint << EOF
server {
    listen 80;
    server_name 157.245.154.5;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /send {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable nginx site
ln -sf /etc/nginx/sites-available/insan-osint /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Reload systemd and start services
systemctl daemon-reload
systemctl enable insan-backend insan-frontend nginx
systemctl start insan-backend insan-frontend nginx

echo "Deployment completed!"
echo "Frontend: http://157.245.154.5"
echo "Backend API: http://157.245.154.5/send/"
echo "WebSocket: ws://157.245.154.5/ws"

# Show service status
systemctl status insan-backend insan-frontend nginx 