import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { createMyTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ActiveSectionProvider } from './contexts/ActiveSectionContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import ResponsiveNavBar from './components/layout/ResponsiveNavBar';
import MainComponent from './components/sections/MainComponent';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/admin/ProtectedRoute';
// Import analytics initialization
import './firebase/analytics';

// Lazy load admin components for better performance
const Login = lazy(() => import('./components/admin/Login'));
const UniversalEditor = lazy(() => import('./components/admin/UniversalEditor'));

// Import enhanced skeleton for better loading UX
import EnhancedPageSkeleton from './components/ui/EnhancedPageSkeleton';

// Loading component for lazy-loaded routes
const PageLoader = () => <EnhancedPageSkeleton />;

// 404 Error Page Component
const NotFoundPage = () => {
  const { t } = useLanguage();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('notFound.title')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        {t('notFound.description')}
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        size="large"
        sx={{ textTransform: 'none' }}
      >
        {t('notFound.goHome')}
      </Button>
    </Box>
  );
};

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
  useEffect(() => {
    document.title = "Ahmad's Portfolio";


  }, []);

  // Mirror the MUI mode onto <html> so Tailwind's `dark:` variant (defined in
  // index.css against the .dark class) tracks the same state.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const theme = createMyTheme(darkMode ? 'dark' : 'light', isRTL ? 'rtl' : 'ltr');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
          <ActiveSectionProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <ConditionalLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <div className="App">
                  <Routes>
                    <Route path="/" element={<MainComponent />} />
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
            </Router>
          </ActiveSectionProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
