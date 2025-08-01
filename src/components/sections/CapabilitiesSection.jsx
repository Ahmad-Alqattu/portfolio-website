import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';

function CapabilitiesSection({ id, title, data, content }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Use data from props
  const capabilitiesData = data?.capabilities || [];
  const sectionTitle = title || 'What Can I Do?';
  const sectionContent = content || '';

  return (
    <Box id={id} sx={{ py: 4 }}>
      {/* Page Title */}
      <Typography variant="h2" component="h2" sx={{           
        textAlign: 'center', 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        mb: 4, 
        color: 'primary.main' 
      }}>
        {sectionTitle}
      </Typography>

      {sectionContent && (
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, maxWidth: '800px', mx: 'auto' }}>
          {sectionContent}
        </Typography>
      )}

      {/* Grid of Cards */}
      <Box sx={{ maxWidth: isMobile? '100%' : '80%', margin: 'auto' }}>
        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {capabilitiesData
            .filter(capability => capability.active !== false)
            .sort((a, b) => (a.order || 999) - (b.order || 999))
            .map((capability, index) => (
            <Grid size={{ xs: 4, sm: 4, md: 4 }} key={capability.id || index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 2,
                  borderRadius: 2,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}
                  >
                    {capability.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                  >
                    {capability.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default CapabilitiesSection;
