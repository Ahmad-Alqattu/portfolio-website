// Live Admin Interface - Shows portfolio with admin controls overlay
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
  styled
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Preview as PreviewIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { logOut } from '../../firebase/auth';
import ResponsiveNavBar from '../layout/ResponsiveNavBar';
import MainComponent from '../sections/MainComponent';
import Footer from '../layout/Footer';
import MediaUpload from './MediaUpload';
import UniversalSectionEditor from './UniversalSectionEditor';

// Styled components
const AdminOverlay = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
}));

const AdminHeader = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const AdminContent = styled(Box)(({ theme }) => ({
  marginTop: '64px', // Height of AppBar
  position: 'relative',
}));

const EditFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: theme.zIndex.fab,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SectionEditOverlay = styled(Box)(({ theme, show }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: theme.zIndex.modal - 1,
  display: show ? 'flex' : 'none',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LiveAdminInterface = () => {
  const { currentUser } = useAuth();
  const { sections, useFirestore } = useData();
  const navigate = useNavigate();
  
  // State management
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [sectionMenuAnchor, setSectionMenuAnchor] = useState(null);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSectionType, setEditingSectionType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  const handleSectionEdit = (sectionType) => {
    setEditingSectionType(sectionType);
    setEditDialogOpen(true);
    setSectionMenuAnchor(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingSectionType(null);
  };

  const availableSections = [
    { type: 'intro', label: 'Profile & Introduction' },
    { type: 'skills', label: 'Skills' },
    { type: 'projects', label: 'Projects' },
    { type: 'experience', label: 'Experience' },
    { type: 'education', label: 'Education' },
    { type: 'capabilities', label: 'Capabilities' },
  ];

  return (
    <AdminOverlay>
      {/* Fixed Admin Header */}
      <AdminHeader position="fixed">
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <DashboardIcon sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ mr: 2 }}>
              Portfolio Admin
            </Typography>
            <Chip 
              label={useFirestore ? 'Live Mode' : 'JSON Mode'} 
              color={useFirestore ? 'success' : 'warning'}
              size="small"
              sx={{ mr: 2 }}
            />
            <Chip 
              label={editMode ? 'Edit Mode' : 'Preview Mode'} 
              color={editMode ? 'error' : 'primary'}
              size="small"
            />
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {/* Edit Mode Toggle */}
            <Tooltip title={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}>
              <IconButton 
                color={editMode ? 'error' : 'default'}
                onClick={() => setEditMode(!editMode)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            {/* Sections Menu */}
            <Tooltip title="Edit Sections">
              <IconButton 
                onClick={(e) => setSectionMenuAnchor(e.currentTarget)}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={sectionMenuAnchor}
              open={Boolean(sectionMenuAnchor)}
              onClose={() => setSectionMenuAnchor(null)}
            >
              {availableSections.map((section) => (
                <MenuItem 
                  key={section.type}
                  onClick={() => handleSectionEdit(section.type)}
                >
                  <EditIcon sx={{ mr: 2 }} />
                  {section.label}
                </MenuItem>
              ))}
            </Menu>

            {/* Media Upload */}
            <Tooltip title="Upload Media">
              <IconButton onClick={() => setMediaDialogOpen(true)}>
                <UploadIcon />
              </IconButton>
            </Tooltip>

            {/* Admin Settings */}
            <Tooltip title="Admin Settings">
              <IconButton 
                onClick={(e) => setAdminMenuAnchor(e.currentTarget)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={adminMenuAnchor}
              open={Boolean(adminMenuAnchor)}
              onClose={() => setAdminMenuAnchor(null)}
            >
              <MenuItem onClick={() => navigate('/admin/classic')}>
                <DashboardIcon sx={{ mr: 2 }} />
                Classic Dashboard
              </MenuItem>
              <MenuItem onClick={() => navigate('/')}>
                <PreviewIcon sx={{ mr: 2 }} />
                Public View
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>

            {/* User Info */}
            <Typography variant="body2" sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
              {currentUser?.email}
            </Typography>
          </Box>
        </Toolbar>
      </AdminHeader>

      {/* Main Portfolio Content */}
      <AdminContent>
        <ResponsiveNavBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <MainComponent />
        <Footer />
      </AdminContent>

      {/* Edit Mode Overlay */}
      {editMode && (
        <EditFab onClick={() => setSectionMenuAnchor(document.body)}>
          <EditIcon />
        </EditFab>
      )}

      {/* Media Upload Dialog */}
      <Dialog 
        open={mediaDialogOpen} 
        onClose={() => setMediaDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Media Upload</Typography>
            <IconButton onClick={() => setMediaDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <MediaUpload />
        </DialogContent>
      </Dialog>

      {/* Section Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Edit {availableSections.find(s => s.type === editingSectionType)?.label}
            </Typography>
            <IconButton onClick={handleCloseEditDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {editingSectionType && (
            <UniversalSectionEditor 
              sectionType={editingSectionType}
              embedded={true}
              onSave={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminOverlay>
  );
};

export default LiveAdminInterface;