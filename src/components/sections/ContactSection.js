// src/components/sections/ContactSection.jsx
import React from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

function ContactSection({ id, title, content }) {
  const { language, t } = useLanguage();
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
        {localize(title, language)}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '1.25rem',
          color: 'text.secondary',
          mb: 4,
        }}
      >
        {localize(content, language)}
      </Typography>
      {/* Simple contact form */}
      <Box component="form" sx={{ maxWidth: '600px', mx: 'auto' }}>
        <TextField
          fullWidth
          label={t('contact.name')}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label={t('contact.email')}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label={t('contact.message')}
          variant="outlined"
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary">
          {t('contact.send')}
        </Button>
      </Box>
    </section>
  );
}

export default ContactSection;
