import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

// Marked with data-not-found so the prerenderer writes it as 404.html.
const NotFoundPage = () => {
  const { t, localizedPath } = useLanguage();
  return (
    <Box
      data-not-found=""
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('notFound.title')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        {t('notFound.description')}
      </Typography>
      <Button
        component={Link}
        to={localizedPath('/')}
        variant="contained"
        size="large"
        sx={{ textTransform: 'none' }}
      >
        {t('notFound.goHome')}
      </Button>
    </Box>
  );
};

export default NotFoundPage;
