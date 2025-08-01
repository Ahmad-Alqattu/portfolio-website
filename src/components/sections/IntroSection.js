import React from 'react';
import { Typography, Box, Avatar, Divider, Link, useMediaQuery, useTheme, Button } from '@mui/material';
import { Download } from '@mui/icons-material';

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

        {/* Elegant Download CV Button */}
        {cvLink && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              component="a"
              href={cvLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<Download />}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, primary.main 100%)',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                textTransform: 'none',
                boxShadow: '0 8px 15px rgba(18, 217, 55, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s ease',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, primary.main 100%)',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 12px 20px rgba(20, 214, 120, 0.68)',
                  '&::before': {
                    left: '100%',
                  },
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(1.01)',
                },
                '& .MuiButton-startIcon': {
                  marginRight: '12px',
                  transition: 'transform 0.3s ease',
                },
                '&:hover .MuiButton-startIcon': {
                  transform: 'rotate(360deg)',
                },
              }}
            >
              Download Resume
            </Button>
          </Box>
        )}
      </Box>
    </section>
  );
}

export default IntroSection;
