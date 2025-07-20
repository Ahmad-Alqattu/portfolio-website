import React from 'react';
import { Box, Typography, IconButton, Link, Tooltip, Grid } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Footer = () => {

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box 
      component="footer" 
      sx={{
        bgcolor: 'background.paper',
        py: 2,
        px: 2,
        position: 'relative',
        mt: 'auto'
      }}
    >
      <Tooltip title="Back to Top">
        <IconButton 
          onClick={handleBackToTop} 
          sx={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'darkprimary.main' },
            width: 40,
            height: 40,
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      </Tooltip>

      {/* Desktop Layout */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Grid container spacing={0}>
          <Grid item md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0 }}>
              Contact Info
            </Typography>
            <Typography variant="body2" color="text.secondary">
              +970 0598-682-679<br />
              <Link href="mailto:ahmadl.qatu@gmail.com" color="primary.main" underline="hover">
                ahmadl.qatu@gmail.com
              </Link><br />
              Ramallah, Palestine
            </Typography>
          </Grid>

          <Grid item md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              Welcome to My Portfolio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thank you for visiting my personal portfolio website.<br />
              Connect with me on email or drop me a message!
            </Typography>
          </Grid>

          <Grid item md={4} sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mr: 4.5 }}>
              Social Links
            </Typography>
            <Box sx={{ mb: 0 }}>
              <IconButton href="https://github.com/Ahmad-Alqattu" target="_blank" sx={{ color: 'text.primary' }}>
                <GitHubIcon />
              </IconButton>
              <IconButton href="https://www.linkedin.com/in/ahmad-al-qattu-987587201/" target="_blank" sx={{ color: 'text.primary' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton href="https://www.facebook.com/ahmadluay.alqatu.5" target="_blank" sx={{ color: 'text.primary' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="mailto:ahmadl.qatu@gmail.com" sx={{ color: 'text.primary' }}>
                <EmailIcon />
              </IconButton>
            </Box>
            <Link sx={{ fontWeight: 'bold', color: 'text.secondary', mr: 5.5 }} href="/assets/AhmadQattu_resume.pdf" color="primary.main" >
              Download CV
            </Link>
          </Grid>
        </Grid>
      </Box>

      {/* Mobile Layout */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
            Welcome to My Portfolio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thank you for visiting my personal portfolio website.<br />
            Connect with me on email or drop me a message!
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
            Contact Info
          </Typography>
          <Typography variant="body2" color="text.secondary">
            +970 0598-682-679<br />
            <Link href="mailto:ahmadl.qatu@gmail.com" color="primary.main" underline="hover">
              ahmadl.qatu@gmail.com
            </Link><br />
            Ramallah, Palestine
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
            Social Links
          </Typography>
          <Box sx={{ mb: 1 }}>
            <IconButton href="https://github.com/Ahmad-Alqattu" target="_blank" sx={{ color: 'primary.main' }}>
              <GitHubIcon />
            </IconButton>
            <IconButton href="https://www.linkedin.com/in/ahmad-al-qattu-987587201/" target="_blank" sx={{ color: 'primary.main' }}>
              <LinkedInIcon />
            </IconButton>
            <IconButton href="https://www.facebook.com/ahmadluay.alqatu.5" target="_blank" sx={{ color: 'primary.main' }}>
              <FacebookIcon />
            </IconButton>
            <IconButton href="mailto:ahmadl.qatu@gmail.com" sx={{ color: 'primary.main' }}>
              <EmailIcon />
            </IconButton>
          </Box>
          <Link href="/assets/AhmadQattu_resume.pdf" color="primary.main" underline="hover">
            Download CV
          </Link>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 2 }}>
        Ahmad AL-Qatu • {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;