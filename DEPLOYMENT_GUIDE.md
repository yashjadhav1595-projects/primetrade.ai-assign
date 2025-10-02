# 🚀 Deployment Guide - PrimeTrade API

## GitHub Pages Deployment

### Option 1: Frontend Only (GitHub Pages)

1. **Enable GitHub Pages:**
   ```bash
   # Push to main branch
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **Configure Repository Settings:**
   - Go to your GitHub repository
   - Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy the frontend

3. **Access your site:**
   - URL: `https://your-username.github.io/your-repo-name`

### Option 2: Full Stack Deployment

#### Backend (Heroku/Railway/Render)

1. **Heroku Deployment:**
   ```bash
   # Install Heroku CLI and login
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-atlas-url
   heroku config:set JWT_ACCESS_SECRET=your-secret-key
   heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
   git push heroku main
   ```

2. **Railway Deployment:**
   ```bash
   # Install Railway CLI
   railway login
   railway new
   railway add mongodb
   railway deploy
   ```

#### Frontend (Netlify/Vercel)

1. **Netlify Deployment:**
   ```bash
   # Build the frontend
   cd frontend
   npm run build
   
   # Deploy to Netlify
   npx netlify-cli deploy --prod --dir=dist
   ```

2. **Update API Base URL:**
   ```bash
   # Set environment variable
   VITE_API_BASE=https://your-backend-app.herokuapp.com/api/v1
   ```

### Option 3: Docker Deployment

1. **Local Docker:**
   ```bash
   docker-compose up -d
   ```

2. **Production Docker:**
   ```bash
   # Build and push to registry
   docker build -t your-registry/primetrade-api .
   docker push your-registry/primetrade-api
   
   # Deploy to your cloud provider
   kubectl apply -f k8s-deployment.yml
   ```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb://localhost:27017/primetrade_api
JWT_ACCESS_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_BASE=https://your-backend-domain.com/api/v1
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Create account at mongodb.com/atlas
2. Create a cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI

### Local MongoDB
```bash
# Install MongoDB
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Linux: sudo apt install mongodb

# Start MongoDB
mongod --dbpath /data/db
```

## SSL/HTTPS Setup

### Let's Encrypt (Free)
```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot --nginx -d your-domain.com
```

### Cloudflare (Recommended)
1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption
4. Set to "Full (strict)" mode

## Performance Optimization

### Backend
- Enable gzip compression ✅
- Implement caching with Redis
- Use PM2 for process management
- Set up load balancing with Nginx

### Frontend
- Build optimization with Vite ✅
- Enable service worker caching
- Implement lazy loading
- Optimize images and assets

## Monitoring & Logging

### Application Monitoring
```bash
# Install monitoring tools
npm install --save newrelic
npm install --save @sentry/node
```

### Server Monitoring
- Set up Uptime monitoring
- Configure error tracking
- Implement health checks ✅

## Security Checklist

- ✅ HTTPS encryption
- ✅ Environment variables for secrets
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Password hashing (bcrypt)
- ✅ JWT token rotation

## Scaling Considerations

### Horizontal Scaling
- Load balancers (Nginx, HAProxy)
- Multiple server instances
- Database sharding/replication
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers
- Code profiling and optimization

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   ```javascript
   // Update CORS_ORIGIN in backend
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **Database Connection:**
   ```bash
   # Check MongoDB connection
   mongo "your-connection-string"
   ```

3. **Environment Variables:**
   ```bash
   # Verify environment variables are loaded
   console.log(process.env.NODE_ENV);
   ```

4. **Build Errors:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test locally with production settings
4. Check network connectivity
5. Review security group/firewall settings

---

**🎯 Your application is now production-ready and can be deployed to any cloud platform!**
