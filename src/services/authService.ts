import { User, AuthResponse, LoginCredentials, SignupCredentials } from '@/types/auth';

// Mock users for demonstration - REPLACE THIS WITH REAL BACKEND API CALLS
const MOCK_USERS = [
  {
    id: '1',
    email: 'driver@test.com',
    password: 'password123',
    name: 'John Driver',
    role: 'driver' as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'manager@test.com',
    password: 'password123',
    name: 'Sarah Manager',
    role: 'fleet_manager' as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'admin@test.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin' as const,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Auth Service - Connect to your Node.js backend
 * 
 * Backend API Endpoints you need to implement:
 * - POST /api/auth/login - Returns { user, token }
 * - POST /api/auth/signup - Returns { user, token }
 * - GET /api/auth/me - Returns current user (requires JWT)
 * - POST /api/auth/logout - Invalidates token
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  /**
   * Login user
   * REPLACE WITH: await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', ... })
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user;
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;

    return {
      user: userWithoutPassword,
      token,
    };
  },

  /**
   * Signup new user
   * REPLACE WITH: await fetch(`${API_BASE_URL}/auth/signup`, { method: 'POST', ... })
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user exists
    if (MOCK_USERS.some(u => u.email === credentials.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: `${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      role: credentials.role,
      createdAt: new Date().toISOString(),
    };

    const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;

    // In real app, this would be saved to backend
    MOCK_USERS.push({ ...newUser, password: credentials.password } as any);

    return {
      user: newUser,
      token,
    };
  },

  /**
   * Get current user from token
   * REPLACE WITH: await fetch(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
   */
  async getCurrentUser(token: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Extract user ID from mock token
    const userId = token.split('_')[3];
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Logout user
   * REPLACE WITH: await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', ... })
   */
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Backend would invalidate the token
  },
};
