import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import { langFromPath, withLang } from '../seo/site';

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

const isAppRoute = (pathname) => pathname.startsWith('/admin') || pathname === '/login';

const readSaved = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'ar' || saved === 'en' ? saved : null;
  } catch {
    return null;
  }
};

// On public pages the language is part of the URL (/ for English, /ar for
// Arabic) so each language is its own crawlable, shareable page. The admin
// screens have no language in their URL and keep the saved preference.
export const LanguageProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const publicRoute = !isAppRoute(location.pathname);
  const [appLanguage, setAppLanguage] = useState(() => readSaved() || 'en');
  const language = publicRoute ? langFromPath(location.pathname) : appLanguage;
  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  // A returning visitor who picked Arabic lands on "/": send them to /ar once.
  useEffect(() => {
    if (publicRoute && language === 'en' && readSaved() === 'ar' && !navigator.webdriver) {
      navigate(withLang(location.pathname, 'ar'), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read through a ref so setLanguage (and the context value) stays the same
  // object while only the URL changes.
  const routeRef = useRef({ location, navigate, publicRoute });
  useEffect(() => {
    routeRef.current = { location, navigate, publicRoute };
  }, [location, navigate, publicRoute]);

  const setLanguage = useCallback((code) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Private mode: the URL still carries the choice.
    }
    setAppLanguage(code);
    const { location: loc, navigate: go, publicRoute: onPublicRoute } = routeRef.current;
    if (onPublicRoute) {
      go(`${withLang(loc.pathname, code)}${loc.search}${loc.hash}`, { replace: true, preventScrollReset: true });
    }
  }, []);

  const toggleLanguage = useCallback(() => setLanguage(language === 'en' ? 'ar' : 'en'), [language, setLanguage]);

  const t = useCallback((key, vars) => {
    const value = resolveKey(translations[language], key) ?? resolveKey(translations.en, key) ?? key;
    if (typeof value === 'string' && vars) {
      return Object.keys(vars).reduce(
        (str, varKey) => str.replace(`{${varKey}}`, vars[varKey]),
        value
      );
    }
    return value;
  }, [language]);

  // Turns a language-less path ("/projects") into this language's URL.
  const localizedPath = useCallback((path) => withLang(path, language), [language]);

  // Stable while the language stays the same: the provider re-renders on every
  // URL change (scroll-sync updates the URL), and a new value object would
  // re-render every section that reads the language.
  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, isRTL, t, localizedPath }),
    [language, setLanguage, toggleLanguage, isRTL, t, localizedPath]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
