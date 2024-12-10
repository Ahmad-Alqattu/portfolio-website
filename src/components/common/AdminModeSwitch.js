// components/common/AdminModeSwitch.jsx
import React from 'react';
import { FormControlLabel, Switch, Box } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminModeSwitch = ({ checked, onChange }) => {
  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      zIndex: 1100,
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={onChange}
            icon={<AdminPanelSettingsIcon />}
          />
        }
        label="Admin"
      />
    </Box>
  );
};

export default AdminModeSwitch;