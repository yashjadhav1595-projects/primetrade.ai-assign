# 📚 API Documentation

## Base URL
```
Development: http://localhost:4000/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "user": {
    "id": "64f1234567890abcdef12345",
    "name": "John Doe", 
    "email": "john@example.com",
    "role": "user"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Error Response
```json
{
  "status": 400,
  "message": "Validation error: email is required"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "Password123!"
}
```

**Validation:**
- `name`: 2-120 characters
- `email`: Valid email format
- `password`: Minimum 8 characters

**Response:** `201 Created`
```json
{
  "user": {
    "id": "64f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com", 
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/login
Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "64f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/refresh-token
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/logout
Logout user and revoke refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out"
}
```

### Tasks (Protected Routes)

#### GET /tasks
Get list of tasks.
- **User role**: Returns only user's own tasks
- **Admin role**: Returns all tasks

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": "64f1234567890abcdef12345",
      "title": "Complete project",
      "description": "Finish the backend API",
      "status": "in_progress",
      "owner": "64f1234567890abcdef12345",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /tasks
Create a new task.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending"
}
```

**Validation:**
- `title`: Required, max 200 characters
- `description`: Optional, max 2000 characters  
- `status`: Optional, enum: ['pending', 'in_progress', 'done']

**Response:** `201 Created`
```json
{
  "task": {
    "id": "64f1234567890abcdef12345",
    "title": "New Task",
    "description": "Task description", 
    "status": "pending",
    "owner": "64f1234567890abcdef12345",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /tasks/:id
Get specific task by ID.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`
```json
{
  "task": {
    "id": "64f1234567890abcdef12345",
    "title": "Task Title",
    "description": "Task description",
    "status": "done", 
    "owner": "64f1234567890abcdef12345",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /tasks/:id
Update existing task.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:** (partial update)
```json
{
  "title": "Updated Title",
  "status": "done"
}
```

**Response:** `200 OK`
```json
{
  "task": {
    "id": "64f1234567890abcdef12345",
    "title": "Updated Title",
    "description": "Task description",
    "status": "done",
    "owner": "64f1234567890abcdef12345", 
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

#### DELETE /tasks/:id
Delete task by ID.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `204 No Content`

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content returned |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers returned**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## Error Handling

All errors follow consistent format:

```json
{
  "status": 400,
  "message": "Detailed error message"
}
```

Common error scenarios:

### Validation Errors
```json
{
  "status": 400,
  "message": "\"email\" must be a valid email, \"password\" length must be at least 8 characters long"
}
```

### Authentication Errors
```json
{
  "status": 401, 
  "message": "Invalid or expired token"
}
```

### Authorization Errors
```json
{
  "status": 403,
  "message": "Forbidden"
}
```

### Resource Not Found
```json
{
  "status": 404,
  "message": "Task not found"
}
```

## Testing with Postman

1. Import `postman_collection.json`
2. Set environment variables:
   - `baseUrl`: http://localhost:4000/api/v1
   - `accessToken`: (set after login)
3. Test authentication flow:
   - Register → Login → Access protected routes
4. Test CRUD operations on tasks

## Interactive Documentation

Visit http://localhost:4000/api-docs for Swagger UI with interactive API testing.
