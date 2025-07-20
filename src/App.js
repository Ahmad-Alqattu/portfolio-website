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
import AdminDashboard from './components/admin/AdminDashboard';
import SectionEditor from './components/admin/SectionEditor';
import MediaUpload from './components/admin/MediaUpload';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.title = "Ahmad Al-Qattu Portfolio "; // Change tab title here
  }, []);
  const theme = createMyTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <ResponsiveNavBar darkMode={darkMode} setDarkMode={setDarkMode} />
                  <MainComponent />
                  <Footer />
                </>
              } />
              <Route path="/login" element={<Login />} />
              
              {/* Protected admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit/:sectionType" element={
                <ProtectedRoute>
                  <SectionEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/media" element={
                <ProtectedRoute>
                  <MediaUpload />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
