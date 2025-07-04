import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AuthState, User } from '../types/auth';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { apiClient } from '../utils/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setHasSeenLanguageSelector: (value: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    hasSeenLanguageSelector: false,
  });
  
  const mounted = useRef(true);

  useEffect(() => {
    initializeAuth();
    
    return () => {
      mounted.current = false;
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const [token, userData, hasSeenLanguageSelector] = await Promise.all([
        storage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        storage.getItem(STORAGE_KEYS.USER_DATA),
        storage.getItem(STORAGE_KEYS.HAS_SEEN_LANGUAGE_SELECTOR),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData);
        apiClient.setToken(token);
        
        if (mounted.current) {
          setAuthState({
            user,
            token,
            isLoading: false,
            hasSeenLanguageSelector: hasSeenLanguageSelector === 'true',
          });
        }
      } else {
        if (mounted.current) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            hasSeenLanguageSelector: hasSeenLanguageSelector === 'true',
          }));
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      if (mounted.current) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  const login = async (token: string, user: User) => {
    try {
      await Promise.all([
        storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
        storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      ]);
      
      apiClient.setToken(token);
      
      if (mounted.current) {
        setAuthState(prev => ({ ...prev, user, token }));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        storage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        storage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
      
      apiClient.setToken(null);
      
      if (mounted.current) {
        setAuthState(prev => ({ ...prev, user: null, token: null }));
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const setHasSeenLanguageSelector = async (value: boolean) => {
    try {
      await storage.setItem(STORAGE_KEYS.HAS_SEEN_LANGUAGE_SELECTOR, value.toString());
      
      if (mounted.current) {
        setAuthState(prev => ({ ...prev, hasSeenLanguageSelector: value }));
      }
    } catch (error) {
      console.error('Set language selector error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      setHasSeenLanguageSelector,
    }}>
      {children}
    </AuthContext.Provider>
  );
};