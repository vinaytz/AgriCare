import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import i18n from '../utils/i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => Promise<void>;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      const savedLanguage = await storage.getItem(STORAGE_KEYS.LANGUAGE);
      if (savedLanguage) {
        setLanguageState(savedLanguage);
        i18n.locale = savedLanguage;
      }
    } catch (error) {
      console.error('Language initialization error:', error);
    }
  };

  const setLanguage = async (newLanguage: string) => {
    try {
      await storage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
      setLanguageState(newLanguage);
      i18n.locale = newLanguage;
    } catch (error) {
      console.error('Set language error:', error);
    }
  };

  const t = (key: string, options?: any) => {
    return i18n.t(key, options);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};