import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { createMyTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ActiveSectionProvider } from './contexts/ActiveSectionContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import ResponsiveNavBar from './components/layout/ResponsiveNavBar';
import MainComponent from './components/sections/MainComponent';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NotFoundPage from './components/layout/NotFoundPage';

// Lazy load admin components for better performance
const Login = lazy(() => import('./components/admin/Login'));
const UniversalEditor = lazy(() => import('./components/admin/UniversalEditor'));

// Import enhanced skeleton for better loading UX
import EnhancedPageSkeleton from './components/ui/EnhancedPageSkeleton';

// Loading component for lazy-loaded routes
const PageLoader = () => <EnhancedPageSkeleton />;

// Component to conditionally render nav and footer
const ConditionalLayout = ({ darkMode, setDarkMode, children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';
  
  return (
    <>
      {!isAdminRoute && <ResponsiveNavBar darkMode={darkMode} setDarkMode={setDarkMode} />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const { isRTL } = useLanguage();

  // Mirror the MUI mode onto <html> so Tailwind's `dark:` variant (defined in
  // index.css against the .dark class) tracks the same state.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Analytics isn't needed to show anything, so it loads once the page is idle.
  useEffect(() => {
    if (navigator.webdriver) return undefined;
    const load = () => import('./firebase/analytics');
    const id = 'requestIdleCallback' in window ? window.requestIdleCallback(load, { timeout: 5000 }) : setTimeout(load, 3000);
    return () => ('cancelIdleCallback' in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  const theme = createMyTheme(darkMode ? 'dark' : 'light', isRTL ? 'rtl' : 'ltr');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
          <ActiveSectionProvider>
              <ConditionalLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <div className="App">
                  <Routes>
                    <Route path="/" element={<MainComponent />} />
                    <Route path="/ar" element={<MainComponent />} />
                    <Route path="/ar/:sectionId" element={<MainComponent />} />
                    <Route path="/:sectionId" element={<MainComponent />} />
                    <Route path="/login" element={
                      <Suspense fallback={<PageLoader />}>
                        <Login />
                      </Suspense>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <UniversalEditor />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
              </ConditionalLayout>
          </ActiveSectionProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}

export default App;
