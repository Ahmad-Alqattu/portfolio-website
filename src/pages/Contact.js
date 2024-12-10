// pages/Contact.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Contact = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact Me
        </Typography>
        <Typography>
          Email: your.email@example.com
        </Typography>
      </Box>
    </Container>
  );
};
export default Contact;
