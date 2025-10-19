# Backend API Specification

This document outlines the backend API endpoints you need to implement to connect with the frontend authentication system.

## Tech Stack
- **Backend**: Node.js (Express.js or Nest.js)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('driver', 'fleet_manager', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Additional Tables (Optional)
```sql
-- Driver-specific data
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id VARCHAR(50),
    fatigue_threshold INTEGER DEFAULT 70,
    UNIQUE(user_id)
);

-- Trip data
CREATE TABLE trips (
    trip_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    fatigue_score INTEGER,
    stress_level INTEGER,
    distance_km DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RAG recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    recommendation_text TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('info', 'warning', 'critical')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. User Signup
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "driver"  // "driver" | "fleet_manager" | "admin"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "driver",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400/409):**
```json
{
  "error": "User with this email already exists"
}
```

**Implementation Notes:**
- Hash password using bcrypt before storing
- Validate email format
- Validate password strength (min 6 chars)
- Generate JWT token with user ID and role
- Store token with expiration (e.g., 7 days)

---

### 2. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "driver",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

**Implementation Notes:**
- Compare hashed passwords using bcrypt
- Return JWT token on successful login
- Never return password hash

---

### 3. Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "driver",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid or expired token"
}
```

**Implementation Notes:**
- Verify JWT token
- Extract user ID from token
- Return current user data

---

### 4. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

**Implementation Notes:**
- Optional: Add token to blacklist
- Frontend will clear token from localStorage

---

## Role-Based Middleware

### Example Express.js Middleware
```javascript
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Role-based authorization middleware
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

// Usage
app.get('/api/admin/users', 
  authenticate, 
  authorize(['admin']), 
  (req, res) => {
    // Admin-only endpoint
  }
);

app.get('/api/fleet/drivers', 
  authenticate, 
  authorize(['fleet_manager', 'admin']), 
  (req, res) => {
    // Fleet manager and admin endpoint
  }
);
```

---

## Environment Variables

Create a `.env` file:
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/driver_safety

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRY=7d

# Server
PORT=3000
NODE_ENV=development

# CORS (for frontend)
FRONTEND_URL=http://localhost:8080
```

---

## Security Best Practices

1. **Password Hashing**
   ```javascript
   const bcrypt = require('bcrypt');
   const saltRounds = 10;
   
   // Hash password on signup
   const hashedPassword = await bcrypt.hash(password, saltRounds);
   
   // Verify password on login
   const isValid = await bcrypt.compare(password, user.password_hash);
   ```

2. **JWT Token**
   - Use strong secret key
   - Set reasonable expiration (7 days recommended)
   - Store in HTTP-only cookies (more secure) or localStorage

3. **CORS Configuration**
   ```javascript
   const cors = require('cors');
   
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

4. **Input Validation**
   - Use libraries like `joi` or `express-validator`
   - Sanitize all user inputs
   - Validate email format
   - Enforce password requirements

5. **SQL Injection Prevention**
   - Always use parameterized queries
   - Use ORM like Sequelize or TypeORM

---

## Frontend Integration

The frontend is already configured to:
- Store JWT token in localStorage
- Send token in Authorization header
- Handle 401 (unauthorized) responses
- Redirect based on user roles

### Frontend Service Location
`src/services/authService.ts` - Replace mock implementations with real API calls

### Example API Call
```typescript
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.error);
}

return data; // { user, token }
```

---

## Testing

### Example cURL Commands

**Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Driver",
    "email": "test@driver.com",
    "password": "password123",
    "role": "driver"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@driver.com",
    "password": "password123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Next Steps

1. Set up Node.js project with Express/Nest.js
2. Configure PostgreSQL database
3. Implement authentication endpoints
4. Add role-based middleware
5. Test with Postman or cURL
6. Update frontend `authService.ts` with real API URL
7. Test frontend-backend integration
8. Implement WebSocket endpoints for real-time data
9. Add RAG system integration
10. Deploy backend (Heroku, AWS, Railway, etc.)

---

## Additional Endpoints to Implement

After authentication is working, implement these endpoints:

- `GET /api/driver/status` - Get current driver fatigue status
- `GET /api/driver/history` - Get trip history
- `GET /api/fleet/drivers` - Get all drivers (fleet manager)
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Create new user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- WebSocket endpoint for real-time monitoring
