import React from 'react';
import { Box, Typography, IconButton, Link, Tooltip, Grid } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

// The brand green (#4caf50) is too light for text on white (2.8:1); a darker
// green passes WCAG AA. Dark mode keeps its own lighter green.
const accent = (theme) => (theme.palette.mode === 'dark' ? theme.palette.primary.main : '#2e7d32');
// Inline text links grow to a 24px tap target.
const tapTarget = { display: 'inline-block', py: 0.5 };

const Footer = ({ data = null }) => {
  const { sections } = useData();
  const { language, t, isRTL } = useLanguage();

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
      cvLink: '',
      copyrightText: 'Ahmad Al-Qattu'
    };
  };

  const footerData = getFooterData();
  const { 
    contactInfo = {
      phone: '+970 0598-682-679',
      email: 'ahmadl.qatu@gmail.com',
      location: 'Ramallah, Palestine'
    }, 
    socialLinks = {
      github: 'https://github.com/Ahmad-Alqattu',
      linkedin: 'https://www.linkedin.com/in/ahmad-al-qattu-987587201/',
      facebook: 'https://www.facebook.com/ahmadluay.alqatu.5',
      email: 'mailto:ahmadl.qatu@gmail.com'
    }, 
    welcomeMessage = {
      title: 'Welcome to My Portfolio',
      description: 'Thank you for visiting my personal portfolio website.\nConnect with me on email or drop me a message!'
    }, 
    cvLink = '', 
    copyrightText = 'Ahmad Al-Qattu'
  } = footerData || {};

  const handleBackToTop = () => {
    // Custom smooth scroll with 1.5s duration
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds
    
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    
    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
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
      <Tooltip title={t('footer.backToTop')}>
        <IconButton 
          onClick={handleBackToTop} 
          sx={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: accent,
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
          <Grid size={{ md: 4 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: accent, mb: 0 }}>
              {t('footer.contactInfo')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contactInfo?.phone || '+970 0598-682-679'}<br />
              <Link href={`mailto:${contactInfo?.email || 'ahmadl.qatu@gmail.com'}`} sx={{ color: accent, ...tapTarget }} underline="hover">
                {contactInfo?.email || 'ahmadl.qatu@gmail.com'}
              </Link><br />
              {localize(contactInfo?.location, language) || 'Ramallah, Palestine'}
            </Typography>
          </Grid>

          <Grid size={{ md: 4 }} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: accent, mb: 2 }}>
              {localize(welcomeMessage.title, language)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {localize(welcomeMessage.description, language)}
            </Typography>
          </Grid>

          <Grid size={{ md: 4 }} sx={{ textAlign: isRTL ? 'left' : 'right' }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: accent, mr: isRTL ? 0 : 4.5, ml: isRTL ? 4.5 : 0 }}>
              {t('footer.socialLinks')}
            </Typography>
            {socialLinks?.enabled !== false && (
              <Box sx={{ mb: 0, mr: isRTL ? 0 : 4.5, ml: isRTL ? 4.5 : 0 }}>
                {socialLinks?.githubEnabled !== false && socialLinks.github && (
                  <IconButton href={socialLinks.github} target="_blank" aria-label="GitHub" sx={{ color: 'text.primary' }}>
                    <GitHubIcon />
                  </IconButton>
                )}
                {socialLinks?.linkedinEnabled !== false && socialLinks.linkedin && (
                  <IconButton href={socialLinks.linkedin} target="_blank" aria-label="LinkedIn" sx={{ color: 'text.primary' }}>
                    <LinkedInIcon />
                  </IconButton>
                )}
                {socialLinks?.facebookEnabled !== false && socialLinks.facebook && (
                  <IconButton href={socialLinks.facebook} target="_blank" aria-label="Facebook" sx={{ color: 'text.primary' }}>
                    <FacebookIcon />
                  </IconButton>
                )}
                {socialLinks?.emailEnabled !== false && socialLinks.email && (
                  <IconButton href={socialLinks.email} aria-label="Email" sx={{ color: 'text.primary' }}>
                    <EmailIcon />
                  </IconButton>
                )}
              </Box>
            )}
            {cvLink && (
              <Link sx={{ fontWeight: 'bold', color: 'text.secondary', mr: isRTL ? 0 : 5.5, ml: isRTL ? 5.5 : 0 }} href={cvLink}>
                {t('footer.downloadCV')}
              </Link>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Mobile Layout */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: accent, mb: 2 }}>
            {localize(welcomeMessage.title, language)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {localize(welcomeMessage.description, language)}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: accent, mb: 2 }}>
            {t('footer.contactInfo')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Link href={`tel:${(contactInfo.phone || '').replace(/[^+\d]/g, '')}`} color="inherit" underline="hover" dir="ltr" sx={tapTarget}>
              {contactInfo.phone}
            </Link><br />
            <Link href={`mailto:${contactInfo.email}`} sx={{ color: accent, ...tapTarget }} underline="hover">
              {contactInfo.email}
            </Link><br />
            {localize(contactInfo.location, language)}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: accent, mb: 2 }}>
            {t('footer.socialLinks')}
          </Typography>
          {socialLinks?.enabled !== false && (
            <Box sx={{ mb: 1 }}>
              {socialLinks?.githubEnabled !== false && socialLinks.github && (
                <IconButton href={socialLinks.github} target="_blank" aria-label="GitHub" sx={{ color: accent }}>
                  <GitHubIcon />
                </IconButton>
              )}
              {socialLinks?.linkedinEnabled !== false && socialLinks.linkedin && (
                <IconButton href={socialLinks.linkedin} target="_blank" aria-label="LinkedIn" sx={{ color: accent }}>
                  <LinkedInIcon />
                </IconButton>
              )}
              {socialLinks?.facebookEnabled !== false && socialLinks.facebook && (
                <IconButton href={socialLinks.facebook} target="_blank" aria-label="Facebook" sx={{ color: accent }}>
                  <FacebookIcon />
                </IconButton>
              )}
              {socialLinks?.emailEnabled !== false && socialLinks.email && (
                <IconButton href={socialLinks.email} aria-label="Email" sx={{ color: accent }}>
                  <EmailIcon />
                </IconButton>
              )}
            </Box>
          )}
          {cvLink && (
            <Link href={cvLink} sx={{ color: accent }} underline="hover">
              {t('footer.downloadCV')}
            </Link>
          )}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 2 }}>
        {copyrightText} • {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;