import { createContext, useContext, useState, useCallback, ReactNode, createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, LoginResponse } from '../services/authService';


interface AuthContextType {
  isAuthenticated: boolean;
  user: LoginResponse | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, password: string) => Promise<void>;
}

// Create context with initial null value
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider(props: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await authService.login({
        userName: username,
        password: password
      });
      
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const signup = useCallback(async (username: string, password: string) => {
    try {
      await authService.signup({
        id: 0,
        username,
        password
      });
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }, [navigate]);

  return createElement(AuthContext.Provider, {
    value: {
      isAuthenticated: !!user,
      user,
      login,
      logout,
      signup
    },
    children: props.children
  });
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}