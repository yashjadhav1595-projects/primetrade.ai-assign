# 🚀 Backend Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended)

1. **Visit**: [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select** your repository: `primetrade.ai-assign`
5. **Add MongoDB database**:
   - Click "Add Service" → "Database" → "MongoDB"
   - Railway will provide a connection string
6. **Set Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=[Railway MongoDB connection string]
   JWT_ACCESS_SECRET=your-super-secure-access-secret
   JWT_REFRESH_SECRET=your-super-secure-refresh-secret
   CORS_ORIGIN=https://yashjadhav1595-projects.github.io
   ```
7. **Deploy**: Railway will automatically deploy your backend

### Option 2: Render

1. **Visit**: [render.com](https://render.com)
2. **Sign up** with GitHub
3. **New Web Service** → Connect your GitHub repo
4. **Configuration**:
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add MongoDB Atlas**:
   - Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Get connection string
6. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=[MongoDB Atlas connection string]
   JWT_ACCESS_SECRET=your-super-secure-access-secret
   JWT_REFRESH_SECRET=your-super-secure-refresh-secret
   CORS_ORIGIN=https://yashjadhav1595-projects.github.io
   ```

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Commands**:
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-connection-string
   heroku config:set JWT_ACCESS_SECRET=your-secret
   heroku config:set JWT_REFRESH_SECRET=your-secret
   heroku config:set CORS_ORIGIN=https://yashjadhav1595-projects.github.io
   git push heroku main
   ```

## After Deployment

1. **Get your backend URL** (e.g., `https://your-app.railway.app`)
2. **Test your API**: Visit `https://your-app.railway.app/health`
3. **Update frontend** to use your backend URL

## MongoDB Setup (if needed)

### MongoDB Atlas (Free)
1. Visit [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for development
5. Get connection string

### Railway MongoDB (Easiest)
- Railway provides MongoDB as a service
- Automatically configured and connected
- No additional setup needed

## Security Checklist

- ✅ Change default JWT secrets
- ✅ Use environment variables for secrets
- ✅ Configure CORS for your domain
- ✅ Use HTTPS in production
- ✅ Whitelist specific IPs for database (optional)

## Testing Your Deployment

```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Test registration
curl -X POST https://your-backend-url.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Password123!"}'
```

## Common Issues

1. **CORS Errors**: Make sure CORS_ORIGIN includes your GitHub Pages URL
2. **Database Connection**: Verify MONGODB_URI is correct
3. **Environment Variables**: Double-check all required variables are set
4. **Port Issues**: Use `process.env.PORT` (Railway/Heroku assign ports)

Your backend will be live at: `https://your-app-name.railway.app` 🚀
