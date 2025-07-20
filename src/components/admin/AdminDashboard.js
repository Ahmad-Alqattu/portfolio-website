// Admin Dashboard Component
import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Home as HomeIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { COLLECTIONS, getCollectionData, migrateDataToFirestore } from '../../firebase/firestore';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      // Try to load from Firestore first
      const collections = Object.values(COLLECTIONS);
      let hasData = false;
      const allSections = [];

      for (const collectionName of collections) {
        const data = await getCollectionData(collectionName);
        if (data.length > 0) {
          hasData = true;
          allSections.push(...data);
        }
      }

      if (!hasData) {
        // If no data in Firestore, offer to migrate from JSON
        setMigrationStatus('no-data');
      } else {
        setSections(allSections);
        setMigrationStatus('data-exists');
      }
    } catch (error) {
      console.error('Error loading sections:', error);
      setMigrationStatus('error');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const result = await logOut();
    if (result.success) {
      navigate('/');
    }
  };

  const handleMigrateData = async () => {
    try {
      setLoading(true);
      // Fetch the JSON data
      const response = await fetch('/data/sectionsData.json');
      const jsonData = await response.json();
      
      // Migrate to Firestore
      const success = await migrateDataToFirestore(jsonData);
      
      if (success) {
        setMigrationStatus('migration-success');
        loadSections(); // Reload sections after migration
      } else {
        setMigrationStatus('migration-error');
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('migration-error');
    }
    setLoading(false);
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'intro': return '👋';
      case 'capabilities': return '🚀';
      case 'skills': return '💻';
      case 'projects': return '📁';
      case 'education': return '🎓';
      case 'experience': return '💼';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Admin Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Portfolio Admin Dashboard
          </Typography>
          <Chip
            label={currentUser?.email || 'Admin'}
            color="secondary"
            sx={{ mr: 2 }}
          />
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            title="View Portfolio"
          >
            <HomeIcon />
          </IconButton>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Migration Status */}
        {migrationStatus === 'no-data' && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleMigrateData}>
                Migrate Now
              </Button>
            }
          >
            No data found in Firestore. Would you like to migrate from the JSON file?
          </Alert>
        )}

        {migrationStatus === 'migration-success' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Data migration completed successfully!
          </Alert>
        )}

        {migrationStatus === 'migration-error' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error during data migration. Please try again or check the console for details.
          </Alert>
        )}

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/projects/new')}
              >
                Add New Project
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => navigate('/admin/media')}
              >
                Upload Media
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => window.open('/', '_blank')}
                startIcon={<HomeIcon />}
              >
                Preview Portfolio
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Sections Grid */}
        <Typography variant="h5" gutterBottom>
          Content Sections
        </Typography>
        <Grid container spacing={3}>
          {Object.values(COLLECTIONS).map((collectionName) => {
            const sectionData = sections.find(s => s.type === collectionName) || {};
            return (
              <Grid item xs={12} sm={6} md={4} key={collectionName}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h4" component="span" sx={{ mr: 1 }}>
                        {getSectionIcon(collectionName)}
                      </Typography>
                      <Typography variant="h6" component="h2">
                        {collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {sectionData.title || `Manage ${collectionName} content`}
                    </Typography>
                    <Chip
                      label={sectionData.id ? 'Has Data' : 'Empty'}
                      color={sectionData.id ? 'success' : 'default'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/admin/edit/${collectionName}`)}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;