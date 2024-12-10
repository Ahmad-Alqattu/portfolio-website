// src/components/sections/IntroSection.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

function IntroSection({ id, title, content }) {
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
        }}
      >
        {content}
      </Typography>
    </section>
  );
}

export default IntroSection;
