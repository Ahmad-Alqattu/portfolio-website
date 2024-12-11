import React from 'react';
import { Typography, Box, Avatar, Divider } from '@mui/material';

function IntroSection({ id, name, title, content, data }) {
  const { subtitle, highlight, image } = data || {};

  return (
    <section
      id={id}
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          margin: 'auto',
          maxWidth: '77%',

  textAlign: 'center', 
          px: 2,
          py: 10,
        }}
      >
        {/* Avatar or profile image */}
        {image && (
          <Avatar
            src={image}
            alt="Profile picture"
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              boxShadow: 3
            }}
          />
        )}

        {/* Display the name as the main heading */}
        {name && (
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {name}
          </Typography>
        )}

        {/* Subtitle (e.g., Full-Stack Developer) */}
        {subtitle && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              mb: 2,
              color: 'text.secondary',
              fontSize: { xs: '1.125rem', md: '1.5rem' },
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Decorative divider and highlight/tagline */}
        {highlight && (
          <>
            <Divider
              sx={{
                my: 3,
                width: '50%',
                mx: 'auto',
                backgroundColor: 'primary.main',
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: 'primary.main',
                fontWeight: '600',
                mb: 2,
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {highlight}
            </Typography>
          </>
        )}

        {/* Main Content (introduction text) */}
        <Typography
          variant="body1"
          sx={{
            display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',

            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'text.secondary',
            lineHeight: 1.6,
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {content}
        </Typography>
      </Box>
    </section>
  );
}

export default IntroSection;
