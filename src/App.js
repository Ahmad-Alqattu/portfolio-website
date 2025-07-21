import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createMyTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ResponsiveNavBar from './components/layout/ResponsiveNavBar';
import MainComponent from './components/sections/MainComponent';
import Footer from './components/layout/Footer';
import Login from './components/admin/Login';
import UniversalEditor from './components/admin/UniversalEditor';
import ProtectedRoute from './components/admin/ProtectedRoute';

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
            <Routes>
              {/* Home portfolio */}
              <Route path="/" element={
                <>
                  <ResponsiveNavBar darkMode={darkMode} setDarkMode={setDarkMode} />
                  <MainComponent />
                  <Footer />
                </>
              } />
              
              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              
              {/* Universal Editor - Edit all sections */}
              <Route path="/edit" element={<UniversalEditor />} />
              
              {/* Admin redirect to universal editor */}
              <Route path="/admin" element={<UniversalEditor />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
