// src/components/sections/ContactSection.jsx
import React from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';

function ContactSection({ id, title, content }) {
  return (
    <section id={id} className="py-16">
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: '2rem',
          fontWeight: 'bold',
          mb: 3,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '1.25rem',
          color: 'text.secondary',
          mb: 4,
        }}
      >
        {content}
      </Typography>
      {/* Simple contact form */}
      <Box component="form" sx={{ maxWidth: '600px', mx: 'auto' }}>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Message"
          variant="outlined"
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary">
          Send Message
        </Button>
      </Box>
    </section>
  );
}

export default ContactSection;
