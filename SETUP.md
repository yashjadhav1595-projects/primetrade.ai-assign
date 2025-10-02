# 🛠️ Detailed Setup Guide

## Prerequisites

- **Node.js**: v18+ (Download from [nodejs.org](https://nodejs.org))
- **MongoDB**: Local installation or cloud (MongoDB Atlas)
- **Git**: For cloning the repository
- **Postman** (optional): For API testing

## Installation Steps

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd primetrade.ai-intern
```

### 2. Install Dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies  
cd frontend
npm install
cd ..
```

### 3. Environment Setup

Create `.env` file in project root:
```bash
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/primetrade_api
JWT_ACCESS_SECRET=your_super_secure_access_secret_minimum_32_chars
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_minimum_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB
winget install MongoDB.Server

# Start MongoDB service (run as administrator)
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 5. Run Application
```bash
# Start both backend and frontend
npm run dev

# Or separately:
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

### 6. Verify Setup
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Swagger docs: http://localhost:4000/api-docs

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
mongod --version

# Restart MongoDB service
net stop MongoDB
net start MongoDB
```

### Port Already in Use
```bash
# Kill process on port 4000
npx kill-port 4000

# Kill process on port 5173  
npx kill-port 5173
```

### npm Install Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

## Development Commands

```bash
npm run dev          # Start both frontend + backend
npm run dev:backend  # Backend only (nodemon)
npm run dev:frontend # Frontend only (Vite)
npm test             # Run backend tests
npm run docs         # Generate API documentation
npm run build        # Production build
```

## Docker Setup

```bash
# Build and run containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

Access:
- Frontend: http://localhost:8080
- Backend: http://localhost:4000
- MongoDB: localhost:27017
