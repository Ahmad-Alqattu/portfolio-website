// Portfolio Data Context with Firestore integration
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllSections, subscribeToSections } from '../firebase/firestore';
import { useAuth } from './AuthContext';

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
  const { currentUser } = useAuth();

  useEffect(() => {
    loadPortfolioData();
  }, [currentUser]); // Re-load when user changes

  const loadPortfolioData = async (userId = null) => {
    setLoading(true);
    setError(null);

    try {
      // Use provided userId or current user's ID, fallback to 'default-user'
      const targetUserId = userId || (currentUser ? currentUser.uid : 'default-user');
      
      // First, try to load from Firestore
      console.log(`Attempting to load from Firestore for user: ${targetUserId}...`);
      const firestoreData = await getAllSections(targetUserId);

      if (firestoreData.length > 0) {
        console.log('Firestore data loaded successfully');
        setSections(firestoreData);
        setUseFirestore(true);
        
        // Set up real-time listeners for authenticated users
        if (currentUser) {
          setupRealtimeListeners(targetUserId);
        }
      } else {
        // Fallback to JSON file only for default user or when no data exists
        if (targetUserId === 'default-user' || !currentUser) {
          console.log('No Firestore data found, falling back to JSON...');
          const response = await fetch('/data/sectionsData.json');
          if (!response.ok) {
            throw new Error(`Failed to fetch JSON data: ${response.status}`);
          }
          const jsonData = await response.json();
          setSections(jsonData);
          setUseFirestore(false);
        } else {
          // For authenticated users with no data, start with empty sections
          setSections([]);
          setUseFirestore(true);
        }
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err);
      setError(err.message);
      
      // Fallback to JSON file on error (only for default user)
      if (!currentUser || targetUserId === 'default-user') {
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
    }

    setLoading(false);
  };

  const setupRealtimeListeners = (userId = null) => {
    const targetUserId = userId || (currentUser ? currentUser.uid : 'default-user');
    console.log(`Setting up real-time listeners for user: ${targetUserId}...`);
    
    // Subscribe to user-specific sections
    const unsubscribe = subscribeToSections((updatedSections) => {
      console.log('Real-time update received:', updatedSections);
      setSections(updatedSections);
    }, targetUserId);

    // Clean up listener on component unmount
    return () => {
      unsubscribe();
    };
  };

  const refreshData = (userId = null) => {
    loadPortfolioData(userId);
  };

  const value = {
    sections,
    loading,
    error,
    useFirestore,
    refreshData,
    loadPortfolioData // Expose this for loading specific user data
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};