import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { createMyTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ResponsiveNavBar from './components/layout/ResponsiveNavBar';
import MainComponent from './components/sections/MainComponent';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Lazy load admin components for better performance
const Login = lazy(() => import('./components/admin/Login'));
const UniversalEditor = lazy(() => import('./components/admin/UniversalEditor'));

// Import enhanced skeleton for better loading UX
import EnhancedPageSkeleton from './components/ui/EnhancedPageSkeleton';

// Loading component for lazy-loaded routes
const PageLoader = () => <EnhancedPageSkeleton />;

// 404 Error Page Component
const NotFoundPage = () => (
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
      Page Not Found
    </Typography>
    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
      The page you are looking for doesn't exist or has been moved.
    </Typography>
    <Button
      component={Link}
      to="/"
      variant="contained"
      size="large"
      sx={{ textTransform: 'none' }}
    >
      Go Back Home
    </Button>
  </Box>
);

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

function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.title = "Ahmad's Portfolio";


  }, []);
  const theme = createMyTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
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
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
