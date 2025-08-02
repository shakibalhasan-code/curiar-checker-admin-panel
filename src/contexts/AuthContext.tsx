import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/authService';
import NotificationService from '../services/notificationService';
import { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string, firstName: string, lastName: string, company?: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize API client with stored auth data
        AuthService.initializeAuth();

        // Check if user is authenticated
        if (AuthService.isAuthenticated()) {
          // Try to refresh user data
          const refreshedUser = await AuthService.refreshUserData();
          if (refreshedUser) {
            setUser(refreshedUser);
          } else {
            // If refresh fails, clear auth
            AuthService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid auth data
        AuthService.logout();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      setUser(response.user);
      NotificationService.loginSuccess();
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.code === 'UNAUTHORIZED') {
        NotificationService.error('Login Failed', 'Invalid email or password. Please try again.');
      } else if (error.code === 'ACCOUNT_LOCKED') {
        NotificationService.error('Account Locked', 'Your account has been temporarily locked. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR') {
        NotificationService.networkError();
      } else {
        NotificationService.apiError(error, 'Login Failed');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
    company?: string,
    phone?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register({
        username,
        email,
        password,
        firstName,
        lastName,
        company: company || '',
        phone: phone || ''
      });

      setUser(response.user);
      NotificationService.success(
        'Registration Successful',
        'Welcome! Your account has been created successfully.'
      );
    } catch (error: any) {
      console.error('Signup error:', error);

      if (error.code === 'CONFLICT') {
        NotificationService.error('Registration Failed', 'An account with this email already exists.');
      } else if (error.code === 'BAD_REQUEST') {
        NotificationService.error('Registration Failed', 'Please check your information and try again.');
      } else if (error.code === 'NETWORK_ERROR') {
        NotificationService.networkError();
      } else {
        NotificationService.apiError(error, 'Registration Failed');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    NotificationService.logoutSuccess();
  };

  const updateProfile = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await AuthService.updateProfile(data);
      setUser(response.user);
      NotificationService.profileUpdated();
    } catch (error: any) {
      console.error('Profile update error:', error);

      if (error.code === 'UNAUTHORIZED') {
        NotificationService.authError();
        logout();
      } else if (error.code === 'BAD_REQUEST') {
        NotificationService.error('Update Failed', 'Please check your information and try again.');
      } else if (error.code === 'NETWORK_ERROR') {
        NotificationService.networkError();
      } else {
        NotificationService.apiError(error, 'Profile Update Failed');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const refreshedUser = await AuthService.refreshUserData();
      if (refreshedUser) {
        setUser(refreshedUser);
      } else {
        logout();
      }
    } catch (error) {
      console.error('User refresh error:', error);
      logout();
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
    isLoading,
    isInitialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};