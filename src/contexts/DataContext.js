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
      // First, try to load from Firestore
      console.log('Attempting to load from Firestore...');
      const firestoreData = await getAllSections();

      if (firestoreData.length > 0) {
        console.log('Firestore data loaded successfully');
        setSections(firestoreData);
        setUseFirestore(true);
        
        // Set up real-time listeners
        setupRealtimeListeners();
      } else {
        // Fallback to JSON file
        console.log('No Firestore data found, falling back to JSON...');
        const response = await fetch('/data/sectionsData.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON data: ${response.status}`);
        }
        const jsonData = await response.json();
        setSections(jsonData);
        setUseFirestore(false);
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err);
      setError(err.message);
      
      // Fallback to JSON file on error
      try {
        console.log('Falling back to JSON file due to error...');
        const response = await fetch('/data/sectionsData.json');
        const jsonData = await response.json();
        setSections(jsonData);
        setUseFirestore(false);
      } catch (jsonErr) {
        console.error('Error loading JSON fallback:', jsonErr);
        setError('Failed to load portfolio data');
      }
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