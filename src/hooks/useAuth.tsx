import React, { createContext, useContext, useState, useCallback } from 'react';
import { account, ID } from '../lib/appwrite';
import { Models } from 'appwrite';

type User = Models.User<Models.Preferences> | null;
type AlertType = 'success' | 'error' | 'info' | 'warning' | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  alert: {
    open: boolean;
    message: string;
    severity: AlertType;
  };
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  showAlert: (message: string, severity: AlertType) => void;
  closeAlert: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: AlertType;
  }>({ open: false, message: '', severity: null });

  // Check current session on mount
  const checkSession = useCallback(async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      showAlert('Login successful!', 'success');
    } catch (error) {
      console.error('Login failed:', error);
      showAlert('Login failed. Please check your credentials.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      showAlert('Registration failed. Please try again.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // Alert helpers
  const showAlert = (message: string, severity: AlertType) => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  // Initial session check
  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    alert,
    login,
    register,
    logout,
    showAlert,
    closeAlert,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
