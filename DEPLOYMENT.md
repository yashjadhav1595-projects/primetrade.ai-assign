# 🚀 Deployment Guide

## Production Deployment Options

### 1. Docker Deployment (Recommended)

#### Using Docker Compose
```bash
# Build and deploy full stack
docker-compose up --build -d

# Check status
docker-compose ps

# View logs  
docker-compose logs -f

# Stop services
docker-compose down
```

#### Individual Container Deployment
```bash
# Build backend image
docker build -t primetrade-api .

# Build frontend image  
docker build -t primetrade-frontend ./frontend

# Run backend
docker run -d -p 4000:4000 \
  -e MONGODB_URI=your_mongo_connection \
  -e JWT_ACCESS_SECRET=your_secret \
  --name primetrade-api primetrade-api

# Run frontend
docker run -d -p 8080:80 \
  --name primetrade-frontend primetrade-frontend
```

### 2. Cloud Platform Deployment

#### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create primetrade-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_atlas_connection
heroku config:set JWT_ACCESS_SECRET=your_secret
heroku config:set JWT_REFRESH_SECRET=your_secret

# Deploy
git push heroku main

# Open app
heroku open
```

#### Vercel Deployment (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard
VITE_API_BASE=https://your-api-domain.com/api/v1
```

#### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway add
railway up
```

### 3. VPS/Server Deployment

#### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- MongoDB
- Nginx (for reverse proxy)
- PM2 (for process management)

#### Setup Steps
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# 4. Install PM2
sudo npm install -g pm2

# 5. Install Nginx
sudo apt install nginx

# 6. Clone and setup project
git clone <your-repo>
cd primetrade.ai-intern
npm install
cd frontend && npm install && npm run build
```

#### PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'primetrade-api',
    script: 'src/server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
      MONGODB_URI: 'mongodb://localhost:27017/primetrade_api',
      JWT_ACCESS_SECRET: 'your_production_secret',
      JWT_REFRESH_SECRET: 'your_production_secret'
    }
  }]
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

#### Nginx Configuration
Create `/etc/nginx/sites-available/primetrade`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/primetrade.ai-intern/frontend/dist;
        try_files $uri /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/primetrade /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Environment Variables for Production

### Backend (.env.production)
```bash
NODE_ENV=production
PORT=4000

# Database (Use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primetrade_api

# JWT Secrets (Generate strong secrets)
JWT_ACCESS_SECRET=super_secure_32_character_secret_key_here
JWT_REFRESH_SECRET=another_secure_32_character_secret_key

# Token Expiration
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Your frontend domain)
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.production)
```bash
VITE_API_BASE=https://your-api-domain.com/api/v1
```

## SSL/HTTPS Setup

### Using Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Logging

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart app
pm2 restart primetrade-api
```

### Log Files Location
- **Application logs**: `~/.pm2/logs/`
- **Nginx logs**: `/var/log/nginx/`
- **MongoDB logs**: `/var/log/mongodb/`

## Performance Optimization

### Database Optimization
```javascript
// Add indexes in production
db.users.createIndex({ email: 1 }, { unique: true })
db.tasks.createIndex({ owner: 1 })
db.tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Nginx Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## Health Checks

### Backend Health Endpoint
The API includes a health check endpoint:
```
GET /health
Response: { "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

### Monitoring Setup
```bash
# Simple health check script
curl -f http://localhost:4000/health || pm2 restart primetrade-api
```

## Backup Strategy

### Database Backup
```bash
# Create backup
mongodump --host localhost:27017 --db primetrade_api --out /backup/

# Restore backup  
mongorestore --host localhost:27017 --db primetrade_api /backup/primetrade_api/
```

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --host localhost:27017 --db primetrade_api --out /backup/$DATE/
# Upload to cloud storage (AWS S3, Google Cloud, etc.)
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT secrets (32+ characters)
- [ ] Use MongoDB Atlas or secured MongoDB instance
- [ ] Enable firewall (UFW)
- [ ] Regular security updates
- [ ] Rate limiting enabled
- [ ] Input validation and sanitization
- [ ] No sensitive data in logs
- [ ] Regular backups
- [ ] Monitor for unusual activity

## Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx, HAProxy)
- Multiple API instances
- MongoDB replica set
- Redis for session storage

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Database optimization
- Connection pooling
- Caching strategies

### Microservices Migration
1. Extract Auth service
2. Extract Tasks service  
3. Add API Gateway
4. Implement service discovery
5. Add monitoring and logging
