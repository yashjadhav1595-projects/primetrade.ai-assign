# 📌 Backend Developer (Intern) – Project Assignment

**Scalable REST API with Authentication & Role-Based Access + Frontend UI**

---

## 🎯 Assignment Overview

This project implements a **secure, scalable REST API** with **JWT authentication**, **role-based access control (RBAC)**, and a **React.js frontend UI** for complete API interaction and testing.

### ✅ Core Features Implemented

#### **Backend (Primary Focus)**
- ✅ **User registration & login APIs** with bcrypt password hashing and JWT authentication
- ✅ **Role-based access control** (user vs admin) with middleware protection
- ✅ **CRUD APIs for Tasks entity** (Create, Read, Update, Delete)
- ✅ **API versioning** (`/api/v1/`) with structured error handling and Joi validation
- ✅ **API documentation** (Swagger UI + Postman collection)
- ✅ **MongoDB database schema** with Mongoose ODM

#### **Frontend (Supportive)**
- ✅ **React.js with Vite** and Material-UI for modern UX
- ✅ **Registration & Login UI** with form validation
- ✅ **Protected dashboard** requiring JWT authentication
- ✅ **Tasks CRUD interface** with search, pagination, and real-time updates
- ✅ **Error/success messages** from API responses with proper UX feedback

#### **Security & Scalability**
- ✅ **Secure JWT token handling** (access + refresh token rotation)
- ✅ **Input sanitization & validation** (XSS protection, MongoDB injection prevention)
- ✅ **Scalable project structure** ready for new modules/microservices
- ✅ **Docker deployment** ready with docker-compose
- ✅ **Rate limiting, CORS, Helmet** security middleware

---

## 🚀 Quick Start

### **One Command Setup**
```bash
# Install dependencies for both backend and frontend
npm install && cd frontend && npm install && cd ..

# Start both backend + frontend simultaneously  
npm run dev
```

### **Access Points**
- 🌐 **Frontend UI**: http://localhost:5173
- 🔗 **Backend API**: http://localhost:4000
- 📚 **Swagger Docs**: http://localhost:4000/api-docs
- 📄 **Postman Collection**: `postman_collection.json`

---

## 🏗️ Architecture & Project Structure

```
primetrade.ai-intern/
├── src/                          # Backend source code
│   ├── controllers/              # Business logic (auth, tasks)
│   ├── routes/v1/               # Versioned API routes
│   ├── models/                  # MongoDB schemas (User, Task, Token)
│   ├── middleware/              # Auth, RBAC, error handling
│   ├── utils/                   # JWT, password, validation helpers
│   ├── docs/                    # Swagger/OpenAPI setup
│   └── server.js               # Application entry point
├── frontend/                    # React.js frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Auth, Dashboard, Tasks pages
│   │   ├── state/             # AuthContext for global state
│   │   ├── services/          # API service with interceptors
│   │   └── routes/            # Protected route components
├── tests/                      # Jest + Supertest API tests
├── docker-compose.yml          # Full-stack deployment
└── README.md                   # This documentation
```

---

## 🔐 Authentication & Security

### **JWT Implementation**
- **Access tokens**: Short-lived (15 minutes) for API calls
- **Refresh tokens**: Long-lived (7 days) with automatic rotation
- **Token storage**: LocalStorage with httpOnly cookie fallback
- **Auto-refresh**: Seamless token renewal via axios interceptors

### **Password Security**
- **bcrypt hashing** with salt rounds (12)
- **Password validation**: Minimum 8 characters with complexity

### **API Security Middleware**
```javascript
// Applied security layers
app.use(helmet());                    // Security headers
app.use(cors());                      // Cross-origin protection  
app.use(rateLimit());                // Rate limiting (100 req/15min)
app.use(mongoSanitize());            // NoSQL injection prevention
app.use(xss());                      // XSS attack prevention
```

---

## 📊 Database Schema

### **User Model**
```javascript
{
  name: String (required, 2-120 chars),
  email: String (required, unique, lowercase),
  passwordHash: String (required, bcrypt),
  role: Enum ['user', 'admin'] (default: 'user'),
  timestamps: { createdAt, updatedAt }
}
```

### **Task Model**
```javascript
{
  title: String (required, max 200 chars),
  description: String (optional, max 2000 chars),
  status: Enum ['pending', 'in_progress', 'done'],
  owner: ObjectId (ref: User, required),
  timestamps: { createdAt, updatedAt }
}
```

### **Token Model** (Refresh Token Management)
```javascript
{
  user: ObjectId (ref: User, required),
  token: String (required, unique),
  type: Enum ['refresh'],
  expiresAt: Date (TTL index),
  revoked: Boolean (default: false)
}
```

---

## 🔧 API Endpoints

### **Authentication APIs**
```
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login  
POST /api/v1/auth/refresh-token # Token refresh
POST /api/v1/auth/logout       # Logout (revoke refresh token)
```

### **Tasks CRUD APIs** (Protected)
```
GET    /api/v1/tasks           # List tasks (user: own, admin: all)
POST   /api/v1/tasks           # Create task
GET    /api/v1/tasks/:id       # Get task by ID
PATCH  /api/v1/tasks/:id       # Update task
DELETE /api/v1/tasks/:id       # Delete task
```

### **Response Format**
```javascript
// Success Response
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" },
  "tokens": { "accessToken": "...", "refreshToken": "..." }
}

// Error Response  
{
  "status": 400,
  "message": "Validation error details"
}
```

---

## 🧪 Testing

### **Run Tests**
```bash
npm test                      # Backend API tests (Jest + Supertest)
cd frontend && npm test       # Frontend component tests (Vitest + RTL)
```

### **Test Coverage**
- ✅ **Authentication flow** (register, login, refresh, logout)
- ✅ **Protected routes** and role-based access
- ✅ **Tasks CRUD operations** with ownership validation
- ✅ **Error handling** and validation responses

---

## 🐳 Docker Deployment

### **Development**
```bash
docker-compose up --build
```
- **Frontend**: http://localhost:8080 (Nginx)
- **Backend**: http://localhost:4000 (Node.js)
- **Database**: MongoDB container with persistent volume

### **Production Ready**
- Multi-stage Docker builds for optimized images
- Environment-based configuration
- Health checks and graceful shutdowns

---

## 📈 Scalability & Production Notes

### **Horizontal Scaling**
- **Stateless API design** enables load balancer distribution
- **JWT tokens** eliminate server-side session storage
- **Database connection pooling** for concurrent requests

### **Microservices Migration Path**
```
Current Monolith → Suggested Microservices:
├── Auth Service (users, tokens, roles)
├── Tasks Service (CRUD operations)  
├── API Gateway (routing, rate limiting)
└── Shared Services (notifications, logging)
```

### **Caching Strategy**
- **Redis integration** ready for hot data caching
- **Database query optimization** with indexes
- **CDN-ready** static assets serving

### **Monitoring & Observability**
- **Structured logging** with request correlation IDs
- **Health check endpoints** (`/health`)
- **Metrics collection** ready (CPU, memory, response times)
- **OpenTelemetry** integration points identified

### **Load Balancing & High Availability**
- **Nginx reverse proxy** configuration included
- **Zero-downtime deployments** with health checks
- **Database replication** ready (MongoDB replica sets)

---

## 🔧 Environment Configuration

### **Backend (.env)**
```bash
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/primetrade_api
JWT_ACCESS_SECRET=your_secure_access_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### **Frontend (.env)**
```bash
VITE_API_BASE=/api/v1
```

---

## 📚 API Documentation

- **Interactive Swagger UI**: http://localhost:4000/api-docs
- **Postman Collection**: Import `postman_collection.json`
- **OpenAPI 3.0 Spec**: Auto-generated from JSDoc comments

---

## 🎯 Assignment Completion Checklist

### **✅ Backend Requirements**
- [x] User registration & login APIs with password hashing and JWT
- [x] Role-based access (user vs admin) 
- [x] CRUD APIs for Tasks entity
- [x] API versioning, error handling, validation
- [x] API documentation (Swagger + Postman)
- [x] MongoDB database schema

### **✅ Frontend Requirements**  
- [x] React.js with modern tooling (Vite)
- [x] Registration & login UI
- [x] Protected dashboard (JWT required)
- [x] CRUD interface for Tasks
- [x] Error/success messages from API

### **✅ Security & Scalability**
- [x] Secure JWT token handling with refresh rotation
- [x] Input sanitization & validation
- [x] Scalable project structure 
- [x] Docker deployment ready
- [x] Caching strategy documented

### **✅ Deliverables**
- [x] GitHub repository with comprehensive README
- [x] Working APIs for authentication & CRUD
- [x] Functional frontend UI integration
- [x] API documentation (Swagger + Postman)
- [x] Scalability notes (microservices, caching, load balancing)

---





---

## 🚀 Next Steps & Future Enhancements

1. **Real-time Features**: WebSocket integration for live task updates
2. **File Uploads**: Task attachments with cloud storage (AWS S3)
3. **Advanced Analytics**: Task completion metrics and dashboards  
4. **Email Notifications**: User registration and task assignment alerts
5. **Mobile App**: React Native app consuming the same APIs
6. **GraphQL Layer**: Optional GraphQL endpoint for flexible querying

---

*This project demonstrates production-ready backend development skills with modern security practices, scalable architecture, and comprehensive testing. Ready for immediate deployment and future enhancements.*


# primetrade.ai-assign
