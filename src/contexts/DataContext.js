// Portfolio Data Context with Firestore integration
import React, { createContext, useContext, useEffect, useState } from 'react';
import { COLLECTIONS, getCollectionData, subscribeToCollection } from '../firebase/firestore';

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
      const collections = Object.values(COLLECTIONS);
      let firestoreData = [];
      let hasFirestoreData = false;

      for (const collectionName of collections) {
        const data = await getCollectionData(collectionName);
        if (data.length > 0) {
          hasFirestoreData = true;
          firestoreData.push(...data);
        }
      }

      if (hasFirestoreData) {
        // Sort sections by a predefined order
        const sectionOrder = ['intro', 'capabilities', 'skills', 'projects', 'education', 'experience'];
        const sortedSections = firestoreData.sort((a, b) => {
          const aIndex = sectionOrder.indexOf(a.type || a.id);
          const bIndex = sectionOrder.indexOf(b.type || b.id);
          return aIndex - bIndex;
        });
        
        setSections(sortedSections);
        setUseFirestore(true);
        
        // Set up real-time listeners for all collections
        setupRealtimeListeners();
      } else {
        // Fallback to JSON file
        const response = await fetch('/data/sectionsData.json');
        const jsonData = await response.json();
        setSections(jsonData);
        setUseFirestore(false);
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err);
      setError(err.message);
      
      // Fallback to JSON file on error
      try {
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
    const unsubscribers = [];
    
    Object.values(COLLECTIONS).forEach(collectionName => {
      const unsubscribe = subscribeToCollection(collectionName, (data) => {
        if (data.length > 0) {
          // Update sections with new data
          setSections(prevSections => {
            const filtered = prevSections.filter(s => s.type !== collectionName);
            return [...filtered, ...data].sort((a, b) => {
              const sectionOrder = ['intro', 'capabilities', 'skills', 'projects', 'education', 'experience'];
              const aIndex = sectionOrder.indexOf(a.type || a.id);
              const bIndex = sectionOrder.indexOf(b.type || b.id);
              return aIndex - bIndex;
            });
          });
        }
      });
      
      unsubscribers.push(unsubscribe);
    });

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsub => unsub());
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