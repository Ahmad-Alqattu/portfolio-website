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

const CertificatesSection = ({ id, title, content, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
      <Typography 
        variant="h2" 
        component="h2" 
        sx={{           
          textAlign: 'center', 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          mb: 2, 
          color: 'primary.main' 
        }}
      >
        {title}
      </Typography>

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
          {content}
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
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  '& .cert-image': {
                    transform: 'scale(1.05)',
                  },
                  '& .cert-title': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Certificate Image */}
                
                {certificate.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={certificate.image.startsWith('http') ? certificate.image : `/${certificate.image}`}
                    alt={`${certificate.name} certificate`}
                    className="cert-image"
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      borderBottom: '1px solid rgba(0,0,0,0.1)'
                    }}
                  />
                  
                )}{certificate.link && (
                      <Chip
                        label="✓ Verified"
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
                        📜 {certificate.name}
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
                            🏢 {certificate.issuer}
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
                      {certificate.description}
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
                        sx={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                            transform: 'translateY(-2px) scale(1.05)',
                          },
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                        }}
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
                        sx={{
                          width: 48,
                          height: 48,
                          border: '2px solid',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            transform: 'translateY(-2px) scale(1.05)',
                          },
                          transition: 'all 0.3s ease'
                        }}
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
