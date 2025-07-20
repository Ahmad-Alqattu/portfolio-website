import React from 'react';
import { Typography, Box, Avatar, Divider, Button, Link, useMediaQuery, useTheme } from '@mui/material';
import Description from '@mui/icons-material/Description';

function IntroSection({ id, name, title, content, data }) {
  const { subtitle, highlight, image, cvLink } = data || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <section
      id={id}
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        marginBottom: '3rem',
      }}
    >
      <Box
        sx={{
          margin: 'auto',
          maxWidth: isMobile? '100%' : '77%',
          textAlign: 'center',
          px: 2,
          py: 0,
        }}
      >
        {/* Display the name as the main heading */}
        {name && (
          <Typography
            variant="h1"
            component="h1"
            marginTop={15}
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: 'text.primary',
              fontSize: { xs: '2.5rem', md: '4rem' },
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
              mb: 3,
              color: 'text.secondary',
              fontSize: { xs: '1.125rem', md: '1.5rem' },
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {subtitle}
          </Typography>
        )}
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
              boxShadow: 3,
            }}
          />
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

        {/* Button to download CV */}
        {cvLink && (
          <Link
  href={cvLink}
  target="_blank"
  rel="noopener noreferrer"
  sx={{
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1, // Spacing between text and icon
    padding: '8px 16px',
    borderRadius: '8px',
    marginTop: 2,
    fontSize: '16px',
    fontWeight: 500,
    backgroundColor: 'primary.main',
    color: 'text.primary',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    '&:hover': {
      backgroundColor: 'primary.dark',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }}
>
  <Description sx={{ fontSize: '20px' }} /> {/* Icon for visual flair */}
  Download CV
</Link>
        )}
      </Box>
    </section>
  );
}

export default IntroSection;
