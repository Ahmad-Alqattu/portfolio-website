// Portfolio Data Context with Firestore integration
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllSections, subscribeToSections } from '../firebase/firestore';

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

  useEffect(() => {
    loadPortfolioData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPortfolioData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Always load from Firestore - no JSON fallback in production
      console.log('Loading from Firestore...');
      const firestoreData = await getAllSections();

      console.log('Firestore data loaded:', firestoreData.length, 'sections');
      setSections(firestoreData);
      setUseFirestore(true);
      
      // Set up real-time listeners
      setupRealtimeListeners();
    } catch (err) {
      console.error('Error loading portfolio data from Firestore:', err);
      setError(`Failed to load data from Firebase: ${err.message}. Please check your connection and Firebase configuration.`);
      setSections([]);
      setUseFirestore(true); // Still mark as using Firestore for admin functionality
    }

    setLoading(false);
  };

  const setupRealtimeListeners = () => {
    console.log('Setting up real-time listeners...');
    
    // Subscribe to all sections
    const unsubscribe = subscribeToSections((updatedSections) => {
      console.log('Real-time update received:', updatedSections);
      setSections(updatedSections);
    });

    // Clean up listener on component unmount
    return () => {
      unsubscribe();
    };
  };

  const refreshData = () => {
    loadPortfolioData();
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