# OSINT SAAS Deployment Instructions

## Step 1: Connect to Server

```bash
ssh root@157.245.154.5
# Password: R4jdoll
```

## Step 2: Run Initial Setup

```bash
# Download and run the deployment script
wget https://raw.githubusercontent.com/your-repo/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

## Alternative: Manual Setup

### 1. Update system and install dependencies

```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs python3 python3-pip python3-venv nginx
mkdir -p /var/www/insan-osint-saas
cd /var/www/insan-osint-saas
python3 -m venv venv
```

### 2. Transfer your application files to the server

From your local machine, run:

```bash
scp -r * root@157.245.154.5:/var/www/insan-osint-saas/
```

### 3. Setup application on server

```bash
cd /var/www/insan-osint-saas
chmod +x setup-app.sh
./setup-app.sh
```

## Step 3: Verify Deployment

Check services status:

```bash
systemctl status insan-backend insan-frontend nginx
```

View logs:

```bash
journalctl -u insan-backend -f
journalctl -u insan-frontend -f
```

## Access Your Application

- **Frontend**: http://157.245.154.5
- **Backend API**: http://157.245.154.5/send/
- **WebSocket**: ws://157.245.154.5/ws

## Troubleshooting

### Restart services:

```bash
systemctl restart insan-backend insan-frontend nginx
```

### Check port usage:

```bash
netstat -tlnp | grep :3000
netstat -tlnp | grep :8000
```

### View detailed logs:

```bash
journalctl -u insan-backend --no-pager
journalctl -u insan-frontend --no-pager
```
