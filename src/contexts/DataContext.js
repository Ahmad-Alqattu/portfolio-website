// Portfolio Data Context with Firestore integration and caching
import React, { createContext, useContext, useEffect, useState } from 'react';

// Prerendered pages embed the build-time snapshot of the sections, so the
// first render needs neither Firestore nor the cache. The Firestore SDK is
// then loaded lazily, only to pick up edits published since that build.
const initialData = typeof window !== 'undefined' && Array.isArray(window.__INITIAL_DATA__)
  ? window.__INITIAL_DATA__
  : null;
const firestoreApi = () => import('../firebase/firestore');

// Cache configuration
const CACHE_KEY = 'portfolio_sections_cache';
const CACHE_TIMESTAMP_KEY = 'portfolio_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [sections, setSections] = useState(() => initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [useFirestore, setUseFirestore] = useState(false);
  const [cleanupRef, setCleanupRef] = useState(null);
  const [cacheLoaded, setCacheLoaded] = useState(false);

  // Cache utility functions
  const getCachedData = () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && cacheTimestamp) {
        const now = Date.now();
        const timestamp = parseInt(cacheTimestamp, 10);
        
        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
          return JSON.parse(cachedData);
        }
      }
    } catch (error) {
      console.warn('Error reading cache:', error);
    }
    return null;
  };

  const setCachedData = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.warn('Error setting cache:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  };

  useEffect(() => {
    // Portfolio content is public and always reads as 'default-user' regardless
    // of who's signed in, so there's nothing to gain by waiting for Firebase
    // Auth to resolve first — that wait was adding Auth SDK init latency onto
    // the critical path before any content could even start loading.
    const userId = 'default-user';
    let cleanupListeners;
    let cancelled = false;

    const subscribe = async () => {
      const cleanup = await setupRealtimeListeners(userId);
      if (cancelled) cleanup();
      else {
        cleanupListeners = cleanup;
        setCleanupRef(() => cleanup);
      }
    };

    let idleId = null;
    if (initialData) {
      // The prerenderer itself (a headless browser) only needs the snapshot.
      if (!navigator.webdriver) {
        idleId = 'requestIdleCallback' in window
          ? window.requestIdleCallback(subscribe, { timeout: 5000 })
          : setTimeout(subscribe, 3000);
      }
    } else {
      loadPortfolioData(userId).then(subscribe);
    }

    return () => {
      cancelled = true;
      if (idleId !== null) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, []);

  async function loadPortfolioData(userId = 'default-user', forceRefresh = false) {
    setLoading(true);
    setError(null);

    try {
      // Always use default-user for consistency
      const finalUserId = 'default-user';
      
      // Check cache first (unless force refresh)
      if (!forceRefresh && !cacheLoaded) {
        const cachedData = getCachedData();
        if (cachedData && cachedData.length > 0) {
    
          const sortedSections = cachedData.sort((a, b) => (a.order || 999) - (b.order || 999));
          setSections(sortedSections);
          setCacheLoaded(true);
          setLoading(false);
          setUseFirestore(true);
          
          // Load fresh data in background
          setTimeout(() => {
            loadPortfolioData(finalUserId, true);
          }, 100);
          return;
        }
      }
      
      // Load from Firestore

      const { getAllSections } = await firestoreApi();
      const firestoreData = await getAllSections(finalUserId);

      if (firestoreData.length > 0) {
        // Ensure sections are properly sorted by order
        const sortedSections = firestoreData.sort((a, b) => (a.order || 999) - (b.order || 999));
        setSections(sortedSections);
        
        // Cache the fresh data
        setCachedData(sortedSections);
      } else {
        setSections([]);
        clearCache(); // Clear cache if no data
      }
      setUseFirestore(true);
      setCacheLoaded(true);
      
    } catch (err) {
      console.error('Error loading portfolio data from Firestore:', err);
      
      // Try to load from cache as fallback
      if (!cacheLoaded) {
        const cachedData = getCachedData();
        if (cachedData && cachedData.length > 0) {
  
          const sortedSections = cachedData.sort((a, b) => (a.order || 999) - (b.order || 999));
          setSections(sortedSections);
          setError('Using cached data. Some features may be limited.');
        } else {
          setError(`Failed to load data from Firebase: ${err.message}. Please check your connection and Firebase configuration.`);
          setSections([]);
        }
      } else {
        setError(`Failed to refresh data: ${err.message}`);
      }
      setUseFirestore(true);
    }

    setLoading(false);
  }

  async function setupRealtimeListeners(userId = 'default-user') {
    const { subscribeToSections } = await firestoreApi();
    // Subscribe to all sections
    const unsubscribe = subscribeToSections((updatedSections) => {
      if (updatedSections.length > 0) {

        // Update cache with real-time data
        const sortedSections = updatedSections.sort((a, b) => (a.order || 999) - (b.order || 999));
        setCachedData(sortedSections);
      } else {
        // Clear cache if no sections
        clearCache();
      }
      setSections(updatedSections);
    }, userId);

    // Clean up listener on component unmount
    return () => {
      unsubscribe();
    };
  }

  const refreshData = async () => {
    await loadPortfolioData('default-user', true); // Force refresh
  };

  const clearDataCache = () => {
    clearCache();
    setCacheLoaded(false);
  };

  const value = {
    sections,
    loading,
    error,
    useFirestore,
    refreshData,
    clearDataCache,
    cacheLoaded
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};