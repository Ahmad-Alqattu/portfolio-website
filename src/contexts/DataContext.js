// Portfolio Data Context with Firestore integration
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllSections, subscribeToSections } from '../firebase/firestore';
import { auth } from '../firebase/config';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useFirestore, setUseFirestore] = useState(false);
  const [cleanupRef, setCleanupRef] = useState(null);

  useEffect(() => {
    let unsubscribeAuth;
    let cleanupListeners;
    let hasLoaded = false;

    const initializeData = () => {
      console.log('🔄 DataContext initializing...');
      
      // Wait for auth state to be determined
      unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
        // Prevent multiple loads
        if (hasLoaded) return;
        
        // Always use default-user for consistency with migration
        const userId = 'default-user';
        console.log('🔐 Auth state changed. User ID:', userId);
        
        if (user) {
          console.log('✅ User authenticated:', user.email);
          console.log('🔑 Using default collection path: users/default-user/sections');
        } else {
          console.log('❌ No authenticated user, using default-user collection');
          console.log('🔑 Using default collection path: users/default-user/sections');
        }
        
        hasLoaded = true;
        
        // Load data for default-user
        await loadPortfolioData(userId);
        
        // Set up real-time listeners
        cleanupListeners = setupRealtimeListeners(userId);
        setCleanupRef(cleanupListeners);
      });
    };

    initializeData();

    // Cleanup function
    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, []);

  const loadPortfolioData = async (userId = 'default-user') => {
    setLoading(true);
    setError(null);

    try {
      // Always use default-user for consistency
      const finalUserId = 'default-user';
      console.log('📊 Loading from Firestore for user:', finalUserId);
      
      // Always load from Firestore - no JSON fallback in production
      const firestoreData = await getAllSections(finalUserId);

      console.log('✅ Firestore data loaded:', firestoreData.length, 'sections');
      if (firestoreData.length > 0) {
        console.log('📋 Section IDs found:', firestoreData.map(s => s.id || s.type));
      } else {
        console.log('⚠️ No sections found in Firestore. You may need to run migration.');
      }
      setSections(firestoreData);
      setUseFirestore(true);
      
    } catch (err) {
      console.error('Error loading portfolio data from Firestore:', err);
      setError(`Failed to load data from Firebase: ${err.message}. Please check your connection and Firebase configuration.`);
      setSections([]);
      setUseFirestore(true); // Still mark as using Firestore for admin functionality
    }

    setLoading(false);
  };

  const setupRealtimeListeners = (userId = 'default-user') => {
    console.log('👂 Setting up real-time listeners for user:', userId);
    
    // Subscribe to all sections
    const unsubscribe = subscribeToSections((updatedSections) => {
      console.log('🔄 Real-time update received:', updatedSections.length, 'sections');
      if (updatedSections.length > 0) {
        console.log('📋 Updated section details:', updatedSections.map(s => ({ id: s.id, type: s.type, title: s.title })));
      }
      setSections(updatedSections);
    }, userId);

    // Clean up listener on component unmount
    return () => {
      console.log('🔌 Cleaning up real-time listeners');
      unsubscribe();
    };
  };

  const refreshData = async () => {
    await loadPortfolioData('default-user');
  };

  const value = {
    sections,
    loading,
    error,
    useFirestore,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};