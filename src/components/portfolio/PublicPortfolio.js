import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { getUserByUsername, getUserProfile, getAllSections } from '../../firebase/firestore';
import MainComponent from '../sections/MainComponent';

const PublicPortfolio = () => {
  const { username, uid } = useParams();
  const [user, setUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPortfolioData();
  }, [username, uid]);

  const loadPortfolioData = async () => {
    setLoading(true);
    setError('');

    try {
      let userData = null;
      let userId = null;

      if (username) {
        // Load by username
        const userResult = await getUserByUsername(username);
        if (userResult.success) {
          userData = userResult.data;
          userId = userResult.data.id;
        } else {
          throw new Error('User not found');
        }
      } else if (uid) {
        // Load by user ID
        const userResult = await getUserProfile(uid);
        if (userResult.success) {
          userData = userResult.data;
          userId = uid;
        } else {
          throw new Error('User not found');
        }
      }

      if (!userData || !userId) {
        throw new Error('User not found');
      }

      setUser(userData);

      // Load user's portfolio sections
      const sectionsData = await getAllSections(userId);
      setSections(sectionsData);

    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError(err.message || 'Failed to load portfolio');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Portfolio not found
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Portfolio Header */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 4,
          mb: 4 
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom>
            {user.displayName}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            @{user.username}
          </Typography>
        </Container>
      </Box>

      {/* Portfolio Content */}
      <Container maxWidth="lg">
        {sections.length > 0 ? (
          <MainComponent sections={sections} />
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              This portfolio is still being set up.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Check back later for updates!
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PublicPortfolio;