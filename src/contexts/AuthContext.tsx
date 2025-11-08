import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, role: User['role']) => Promise<User>;
  signInWithGoogle: (role: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: User['role'] | User['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage and handle Google redirect
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First, check if we're returning from a Google redirect
        const redirectResult = await authService.getRedirectResult();
        if (redirectResult) {
          setUser(redirectResult.user);
          setToken(redirectResult.token);
          localStorage.setItem(TOKEN_KEY, redirectResult.token);
          setIsLoading(false);
          return;
        }

        // Otherwise, check for stored token
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          const currentUser = await authService.getCurrentUser(storedToken);
          if (currentUser) {
            setUser(currentUser);
            setToken(storedToken);
          } else {
            localStorage.removeItem(TOKEN_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem(TOKEN_KEY, response.token);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: User['role']): Promise<User> => {
    try {
      const response = await authService.signup({ name, email, password, role });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem(TOKEN_KEY, response.token);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async (role: UserRole): Promise<User> => {
    try {
      const response = await authService.signInWithGoogle(role);
      if (response) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem(TOKEN_KEY, response.token);
        return response.user;
      } else {
        // Handle redirect case - user will be redirected
        throw new Error('Redirecting to Google...');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const hasRole = (role: User['role'] | User['role'][]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        signInWithGoogle,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
