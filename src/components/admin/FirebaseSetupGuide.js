// Firebase Setup Guide Component
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Alert,
  AlertTitle,
  Link,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Launch as LaunchIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { migrateJsonToFirestore } from '../../utils/migrateToFirestore';

const FirebaseSetupGuide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [showEnvExample, setShowEnvExample] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleMigration = async () => {
    try {
      setMigrationStatus('migrating');
      const result = await migrateJsonToFirestore();
      
      if (result.success) {
        setMigrationStatus('success');
      } else {
        setMigrationStatus('error');
      }
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationStatus('error');
    }
  };

  const steps = [
    {
      label: 'Create Firebase Project',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            First, you need to create a Firebase project:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Go to Firebase Console" 
                secondary={
                  <Link href="https://console.firebase.google.com/" target="_blank" rel="noopener">
                    https://console.firebase.google.com/ <LaunchIcon fontSize="small" />
                  </Link>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Click 'Create a project'" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Enter project name (e.g., 'ahmad-portfolio')" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Disable Google Analytics (optional)" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      label: 'Enable Firebase Services',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Enable the required Firebase services:
          </Typography>
          
          <Typography variant="h6" gutterBottom>Firestore Database:</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Go to 'Firestore Database' in sidebar" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Click 'Create database'" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Start in 'Test mode'" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Authentication:</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Go to 'Authentication' in sidebar" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Enable 'Email/Password' method" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Storage:</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Go to 'Storage' in sidebar" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Start in 'Test mode'" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      label: 'Get Firebase Configuration',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Get your Firebase configuration:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Go to Project Settings (gear icon)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Scroll down to 'Your apps'" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Click 'Web app' icon (<//>)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Register your app (name: 'portfolio-website')" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Copy the configuration object" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      label: 'Update Environment Variables',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Update your .env file with the real Firebase configuration:
          </Typography>
          
          <Button 
            variant="outlined" 
            onClick={() => setShowEnvExample(!showEnvExample)}
            endIcon={showEnvExample ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ mb: 2 }}
          >
            {showEnvExample ? 'Hide' : 'Show'} .env Example
          </Button>
          
          <Collapse in={showEnvExample}>
            <Paper elevation={0} sx={{ bgcolor: 'grey.100', p: 2, mb: 2 }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
{`# Replace these with your actual Firebase config values
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id`}
              </Typography>
            </Paper>
          </Collapse>

          <Alert severity="warning">
            <AlertTitle>Important</AlertTitle>
            Make sure to restart your development server after updating the .env file!
          </Alert>
        </Box>
      )
    },
    {
      label: 'Migrate Data to Firestore',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Once Firebase is configured, migrate your portfolio data:
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleMigration}
            disabled={migrationStatus === 'migrating'}
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            {migrationStatus === 'migrating' ? 'Migrating...' : 'Migrate JSON Data to Firestore'}
          </Button>

          {migrationStatus === 'success' && (
            <Alert severity="success">
              <AlertTitle>Migration Successful!</AlertTitle>
              Your portfolio data has been migrated to Firestore. You can now edit content through the admin panel.
            </Alert>
          )}

          {migrationStatus === 'error' && (
            <Alert severity="error">
              <AlertTitle>Migration Failed</AlertTitle>
              Please check your Firebase configuration and try again. Make sure Firestore is enabled and properly configured.
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will copy all your portfolio sections from the JSON file to Firestore, enabling real-time editing through the admin panel.
          </Typography>
        </Box>
      )
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Firebase Setup Guide
      </Typography>
      
      <Typography variant="body1" paragraph color="text.secondary">
        Follow these steps to enable Firebase integration for your portfolio.
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              {step.content}
              <Box sx={{ mb: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mr: 1 }}
                  disabled={index === steps.length - 1}
                >
                  {index === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <AlertTitle>Setup Complete!</AlertTitle>
          Your Firebase integration is now ready. Your portfolio will automatically load from Firestore when available, 
          with JSON fallback for reliability.
        </Alert>
      )}
    </Paper>
  );
};

export default FirebaseSetupGuide;
