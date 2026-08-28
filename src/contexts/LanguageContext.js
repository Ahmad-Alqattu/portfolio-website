import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const translations = { en, ar };
const STORAGE_KEY = 'portfolioLanguage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const resolveKey = (dict, key) =>
  key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), dict);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key, vars) => {
    const value = resolveKey(translations[language], key) ?? resolveKey(translations.en, key) ?? key;
    if (typeof value === 'string' && vars) {
      return Object.keys(vars).reduce(
        (str, varKey) => str.replace(`{${varKey}}`, vars[varKey]),
        value
      );
    }
    return value;
  };

  const value = { language, setLanguage, toggleLanguage, isRTL, t };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
