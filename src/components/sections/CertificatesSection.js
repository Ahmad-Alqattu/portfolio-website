import React from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Box,
  Button,
  Chip,
  Paper,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import { 
  Download, 
  Visibility, 
  OpenInNew
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import SectionHeading from '../ui/SectionHeading';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

// Liquid-glass action buttons, matching the floating nav and FABs. `primary`
// gets a tinted fill so the two actions still read as primary/secondary
// without falling back to an unrelated hard-coded blue.
const glassIconButtonSx = (theme, primary) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    width: 48,
    height: 48,
    color: 'primary.main',
    bgcolor: primary
      ? isDark
        ? 'rgba(129,199,132,0.18)'
        : 'rgba(76,175,80,0.14)'
      : isDark
        ? 'rgba(255,255,255,0.06)'
        : 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(14px) saturate(180%)',
    WebkitBackdropFilter: 'blur(14px) saturate(180%)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.75)'}`,
    boxShadow: isDark
      ? '0 6px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
      : '0 6px 18px rgba(20,60,30,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, background-color 0.3s ease',
    '&:hover': {
      bgcolor: isDark ? 'rgba(129,199,132,0.28)' : 'rgba(76,175,80,0.22)',
      transform: 'translateY(-3px) scale(1.06)',
      boxShadow: isDark
        ? `0 12px 26px rgba(0,0,0,0.45), 0 0 18px ${theme.palette.primary.main}55`
        : `0 12px 26px rgba(20,60,30,0.18), 0 0 18px ${theme.palette.primary.main}44`,
    },
    '&:active': {
      transform: 'translateY(-1px) scale(1.02)',
    },
    '& .MuiSvgIcon-root': {
      transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
    },
    '&:hover .MuiSvgIcon-root': {
      transform: primary ? 'scale(1.15)' : 'translateY(2px)',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': { transform: 'none' },
    },
  };
};

const CertificatesSection = ({ id, title, content, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { language, t } = useLanguage();
  const certificates = data?.certificates || [];

  // Filter active certificates and sort by order
  const activeCertificates = certificates
    .filter(cert => cert.active !== false)
    .sort((a, b) => (a.order || 999) - (b.order || 999));

  if (activeCertificates.length === 0) {
    return null; // Don't render if no certificates
  }

  return (
    <Box id={id} sx={{ maxWidth: isMobile ? '95%' : '83%', margin: 'auto', py: 6, px: 2 }}>
      {/* Section Title */}
      <SectionHeading sectionId={id} sx={{ mb: 2 }}>{localize(title, language)}</SectionHeading>

      {/* Section Description */}
      {content && (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            mb: 4,
            color: 'text.secondary',
            fontSize: '1.1rem',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          {localize(content, language)}
        </Typography>
      )}

      {/* Certificates Grid */}
      <Grid container spacing={4}>
        {activeCertificates.map((certificate, index) => (
          <Grid size={{ xs: 12, sm: 6}} key={certificate.id || index}>
          
            <Paper 
              elevation={4} 
              sx={{ 
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 20px 40px rgba(0,0,0,0.5)'
                    : '0 20px 40px rgba(0,0,0,0.12)',
                  '& .cert-image': {
                    transform: 'scale(1.05)',
                  },
                  '& .cert-title': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <Card sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Certificate Image */}
                
                {certificate.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={certificate.image.startsWith('http') ? certificate.image : `/${certificate.image}`}
                    alt={`${localize(certificate.name, language)} certificate`}
                    className="cert-image"
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      borderBottom: '1px solid rgba(0,0,0,0.1)'
                    }}
                  />

                )}{certificate.link && (
                      <Chip
                        label={`✓ ${t('certificates.verified')}`}
                        color="success"
                        size="small"
                        sx={{ 
                          position: 'absolute',
                          top: 6,
                          left: 2,
                          zIndex: 1
                        }}
                      />
                    )}

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Certificate Header */}
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    {/* Verification Status - Fixed Position */}
                    
                    
                    {/* Certificate Info - Compact Layout */}
               
                      {/* Certificate Name */}
                      <Typography 
                        variant="h6" 
                        className="cert-title"
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'primary.main',
                          transition: 'color 0.3s ease',
                          mb: 1,
                          fontSize: '1rem',
                          lineHeight: 1.3
                        }}
                      >
                        📜 {localize(certificate.name, language)}
                      </Typography>
                      
                      {/* Certificate Details - Compact Row */}
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 0.5, sm: 2 },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        mb: 1
                      }}>
                        {/* Issuing Organization */}
                        {certificate.issuer && (
                          <Typography variant="body2" sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}>
                            🏢 {localize(certificate.issuer, language)}
                          </Typography>
                        )}

                        {/* Issue Date */}
                        {certificate.issueDate && (
                          <Typography variant="body2" sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}>
                            📅 {certificate.issueDate}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                  {/* Description */}
                  {certificate.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        flexGrow: 1
                      }}
                    >
                      {localize(certificate.description, language)}
                    </Typography>
                  )}

                  {/* Action Buttons - Icon Only */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    justifyContent: 'center',
                    mt: 'auto'
                  }}>
                    {/* Primary Action - View Certificate (uses link if available, otherwise pdf) */}
                    {(certificate.link || certificate.pdf) && (
                      <IconButton
                        href={certificate.link || certificate.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View certificate"
                        sx={glassIconButtonSx(theme, true)}
                      >
                        <Visibility />
                      </IconButton>
                    )}

                    {/* Download Button - Only if PDF is different from link */}
                    {certificate.pdf && certificate.link && certificate.pdf !== certificate.link && (
                      <IconButton
                        href={certificate.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download certificate"
                        sx={glassIconButtonSx(theme, false)}
                      >
                        <Download />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>  
  );
};

CertificatesSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  data: PropTypes.shape({
    certificates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        issuer: PropTypes.string,
        issueDate: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.string,
        pdf: PropTypes.string,
        link: PropTypes.string,
        active: PropTypes.bool,
        order: PropTypes.number,
      })
    ),
  }),
};

export default CertificatesSection;
