import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Twitter } from '@mui/icons-material';

function Footer() {
  return (
    <Box sx={{ padding: '20px', backgroundColor: '#0d47a1', color: '#fff', textAlign: 'center' }}>
      <Typography variant="body1">© 2024 Ahmad Al-Qattu. All rights reserved.</Typography>
      <Box>
        <IconButton color="inherit" href="https://github.com" target="_blank">
          <GitHub />
        </IconButton>
        <IconButton color="inherit" href="https://linkedin.com" target="_blank">
          <LinkedIn />
        </IconButton>
        <IconButton color="inherit" href="https://twitter.com" target="_blank">
          <Twitter />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Footer;
