import React from 'react';
import { Typography, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Chrono } from 'react-chrono';

const TimelineSection = ({ id, title, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!data || !data.timeline) {
    return null;
  }

  const items = data.timeline.map(item => ({
    title: item.date,
    cardTitle: item.title,
    cardSubtitle: item.subtitle,
    cardDetailedText: item.description
  }));

  return (
    <Box id={id} sx={{ py: 8 }}>
      <Typography variant="h2" component="h2" gutterBottom align="center">
        {title}
      </Typography>
      <Chrono
        items={items}
        mode="VERTICAL_ALTERNATING"
        theme={{
          primary: theme.palette.primary.main,
          secondary: theme.palette.secondary.main,
          cardBgColor: theme.palette.background.paper,
          cardForeColor: theme.palette.text.primary,
          titleColor: theme.palette.text.primary,
        }}
        fontSizes={{
          cardSubtitle: '0.85rem',
          cardText: '0.8rem',
          cardTitle: '1rem',
          title: '1rem',
        }}
        slideShow
        slideItemDuration={3000}
        scrollable={{ scrollbar: false }}
        useReadMore={false}
        allowDynamicUpdate
        isMobile={isMobile}
      />
    </Box>
  );
};

export default TimelineSection;