// Authentication Context
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChangedListener, isUserAdmin } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Development mode bypass
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      // In development mode, simulate an authenticated admin user
      const devUser = {
        uid: 'dev-user',
        email: 'dev@admin.com',
        displayName: 'Development Admin'
      };
      setCurrentUser(devUser);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      setIsAdmin(isUserAdmin(user));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};