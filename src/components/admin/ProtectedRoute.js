// Protected Route Component
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!currentUser || !isAdmin) {
    // Show access denied for non-admin users who are authenticated
    if (currentUser && !isAdmin) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
          flexDirection="column"
          gap={2}
          sx={{ textAlign: 'center', p: 3 }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Only ahmadl.qatu@gmail.com is authorized.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Go to Portfolio
            </button>
          </Box>
        </Box>
      );
    }
    
    // Redirect to login page with return url for unauthenticated users
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;