// Authentication Context
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const isAppRoute = () => window.location.pathname.startsWith('/admin') || window.location.pathname === '/login';

// The public pages never wait on auth: visitors are anonymous, and the only
// thing auth changes there is the owner's small "Edit" link. So the Firebase
// Auth SDK loads right away only on the admin screens, and after the page is
// idle everywhere else, keeping it out of the first load.
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    const start = async () => {
      const { onAuthStateChangedListener, isUserAdmin } = await import('../firebase/auth');
      if (cancelled) return;
      unsubscribe = onAuthStateChangedListener((user) => {
        setCurrentUser(user);
        setIsAdmin(isUserAdmin(user));
        setLoading(false);
      });
    };

    let idleId = null;
    if (isAppRoute()) {
      start();
    } else if (!navigator.webdriver) {
      idleId = 'requestIdleCallback' in window ? window.requestIdleCallback(start, { timeout: 4000 }) : setTimeout(start, 2500);
    }

    return () => {
      cancelled = true;
      if (idleId !== null) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
