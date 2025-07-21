import React from 'react';
import { Box, Typography, IconButton, Link, Tooltip, Grid } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useData } from '../../contexts/DataContext';

const Footer = ({ data = null }) => {
  const { sections } = useData();

  // Get footer data from props or from Firebase sections
  const getFooterData = () => {
    if (data) return data;
    
    const footerSection = sections.find(s => s.type === 'footerAndLinks');
    return footerSection?.data || {
      contactInfo: {
        phone: '+970 0598-682-679',
        email: 'ahmadl.qatu@gmail.com',
        location: 'Ramallah, Palestine'
      },
      socialLinks: {
        github: 'https://github.com/Ahmad-Alqattu',
        linkedin: 'https://www.linkedin.com/in/ahmad-al-qattu-987587201/',
        facebook: 'https://www.facebook.com/ahmadluay.alqatu.5',
        email: 'mailto:ahmadl.qatu@gmail.com'
      },
      welcomeMessage: {
        title: 'Welcome to My Portfolio',
        description: 'Thank you for visiting my personal portfolio website.\nConnect with me on email or drop me a message!'
      },
      cvLink: '/assets/AhmadQattu_resume.pdf',
      copyrightText: 'Ahmad AL-Qatu'
    };
  };

  const footerData = getFooterData();
  const { contactInfo, socialLinks, welcomeMessage, cvLink, copyrightText } = footerData;

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
              {contactInfo.phone}<br />
              <Link href={`mailto:${contactInfo.email}`} color="primary.main" underline="hover">
                {contactInfo.email}
              </Link><br />
              {contactInfo.location}
            </Typography>
          </Grid>

          <Grid item md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              {welcomeMessage.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {welcomeMessage.description}
            </Typography>
          </Grid>

          <Grid item md={4} sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mr: 4.5 }}>
              Social Links
            </Typography>
            <Box sx={{ mb: 0 }}>
              <IconButton href={socialLinks.github} target="_blank" sx={{ color: 'text.primary' }}>
                <GitHubIcon />
              </IconButton>
              <IconButton href={socialLinks.linkedin} target="_blank" sx={{ color: 'text.primary' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton href={socialLinks.facebook} target="_blank" sx={{ color: 'text.primary' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href={socialLinks.email} sx={{ color: 'text.primary' }}>
                <EmailIcon />
              </IconButton>
            </Box>
            <Link sx={{ fontWeight: 'bold', color: 'text.secondary', mr: 5.5 }} href={cvLink} color="primary.main" >
              Download CV
            </Link>
          </Grid>
        </Grid>
      </Box>

      {/* Mobile Layout */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
            {welcomeMessage.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {welcomeMessage.description}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
            Contact Info
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {contactInfo.phone}<br />
            <Link href={`mailto:${contactInfo.email}`} color="primary.main" underline="hover">
              {contactInfo.email}
            </Link><br />
            {contactInfo.location}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
            Social Links
          </Typography>
          <Box sx={{ mb: 1 }}>
            <IconButton href={socialLinks.github} target="_blank" sx={{ color: 'primary.main' }}>
              <GitHubIcon />
            </IconButton>
            <IconButton href={socialLinks.linkedin} target="_blank" sx={{ color: 'primary.main' }}>
              <LinkedInIcon />
            </IconButton>
            <IconButton href={socialLinks.facebook} target="_blank" sx={{ color: 'primary.main' }}>
              <FacebookIcon />
            </IconButton>
            <IconButton href={socialLinks.email} sx={{ color: 'primary.main' }}>
              <EmailIcon />
            </IconButton>
          </Box>
          <Link href={cvLink} color="primary.main" underline="hover">
            Download CV
          </Link>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 2 }}>
        {copyrightText} • {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;