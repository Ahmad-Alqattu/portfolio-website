import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  CloudUpload as UploadIcon,
  Description as CVIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../../firebase/firestore';
import { uploadProfilePicture, uploadCV } from '../../firebase/storage';
import { logOut } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import MediaUploadZone from './MediaUploadZone';

const ProfileAdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    website: '',
    location: '',
    title: ''
  });

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      const result = await getUserProfile(currentUser.uid);
      if (result.success) {
        setUserProfile(result.data);
        setFormData({
          displayName: result.data.displayName || '',
          username: result.data.username || '',
          bio: result.data.bio || '',
          website: result.data.website || '',
          location: result.data.location || '',
          title: result.data.title || ''
        });
      }
    } catch (err) {
      setError('Failed to load profile');
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateUserProfile(currentUser.uid, formData);
      if (result.success) {
        setUserProfile({ ...userProfile, ...formData });
        setEditMode(false);
        setSuccess('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    }
    setSaving(false);
  };

  const handleProfilePictureUpload = async (files) => {
    if (files.length > 0) {
      const uploadedFile = files[0];
      try {
        await updateUserProfile(currentUser.uid, {
          profilePicture: uploadedFile.downloadURL
        });
        setUserProfile(prev => ({
          ...prev,
          profilePicture: uploadedFile.downloadURL
        }));
        setSuccess('Profile picture updated successfully!');
      } catch (err) {
        setError('Failed to update profile picture');
      }
    }
  };

  const handleCVUpload = async (files) => {
    if (files.length > 0) {
      const uploadedFile = files[0];
      try {
        await updateUserProfile(currentUser.uid, {
          cvUrl: uploadedFile.downloadURL
        });
        setUserProfile(prev => ({
          ...prev,
          cvUrl: uploadedFile.downloadURL
        }));
        setSuccess('CV updated successfully!');
      } catch (err) {
        setError('Failed to update CV');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              Portfolio Admin Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/admin')}
              >
                Content Editor
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                src={userProfile?.profilePicture}
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '3rem'
                }}
              >
                {userProfile?.displayName?.charAt(0) || currentUser?.email?.charAt(0)}
              </Avatar>

              <Typography variant="h5" gutterBottom>
                {userProfile?.displayName || 'No Name Set'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{userProfile?.username || 'no-username'}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {currentUser?.email}
              </Typography>

              {userProfile?.title && (
                <Chip 
                  label={userProfile.title} 
                  color="primary" 
                  sx={{ mt: 1 }} 
                />
              )}

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={`/u/${userProfile?.username}`}
                  target="_blank"
                  sx={{ mb: 2 }}
                >
                  View Public Portfolio
                </Button>
                
                {userProfile?.cvUrl && (
                  <Button
                    variant="outlined"
                    fullWidth
                    href={userProfile.cvUrl}
                    target="_blank"
                    startIcon={<CVIcon />}
                  >
                    Download CV
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Profile Information */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Profile Information
                </Typography>
                {!editMode ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setEditMode(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!editMode}
                    helperText="Used in portfolio URL: /u/username"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Professional Title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={!editMode}
                    placeholder="e.g., Software Engineer"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!editMode}
                    placeholder="e.g., New York, NY"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!editMode}
                    placeholder="https://yourwebsite.com"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!editMode}
                    placeholder="Tell people about yourself..."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Profile Picture Upload */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Profile Picture
              </Typography>
              <MediaUploadZone
                uploadType="profile"
                maxFiles={1}
                onUploadComplete={handleProfilePictureUpload}
              />
            </Paper>
          </Grid>

          {/* CV Upload */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                CV / Resume
              </Typography>
              <MediaUploadZone
                uploadType="cv"
                maxFiles={1}
                onUploadComplete={handleCVUpload}
              />
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Edit Portfolio Content"
                    secondary="Manage your portfolio sections, projects, and skills"
                  />
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin')}
                  >
                    Go to Editor
                  </Button>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <UploadIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Upload Media"
                    secondary="Upload images and videos for your projects"
                  />
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin/media')}
                  >
                    Upload Media
                  </Button>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfileAdminDashboard;