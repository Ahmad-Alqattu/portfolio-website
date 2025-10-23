import React from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useMediaQuery,
  useTheme,
  Avatar
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PropTypes from 'prop-types';

const ExperienceSection = ({ id, title, experiences = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box id={id} sx={{ maxWidth: isMobile ? '100%' : '75%', margin: 'auto', py: 6 }}>
      {/* Section Title */}
      <Typography 
        variant="h2" 
        component="h2" 
        sx={{           
          textAlign: 'center', 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          mb: 4, 
          color: 'primary.main' 
        }}
      >
        {title}
      </Typography>

      {/* Experiences List */}
      <Grid container spacing={4}>
        {experiences
          .filter(experience => experience.active !== false)
          .sort((a, b) => (a.order || 999) - (b.order || 999))
          .map((experience, index) => (
          <Grid size={{ xs: 12 }} key={experience.id || index}>
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(0,0,0,0.05)',
                '&:hover': {
                  transform: 'translateY(-0px) scale(1.006)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.08)',
                  '& .company-title': {
                    // color: 'primary.main',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  },
                  '& .job-title': {
                    // color: 'secondary.main'
                  }
                }
              }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Company Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {experience.logo && (
                      <Avatar
                        src={experience.logo}
                        alt={`${experience.company} logo`}
                        sx={{ width: 50, height: 50, mr: 2 }}
                        variant="rounded"
                      />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h5" 
                        component="h3"
                        className="company-title"
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'text.primary',
                          mb: 0.5,
                          textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {experience.company}
                      </Typography>
                      <Typography 
                        variant="h6"
                        className="job-title" 
                        sx={{ 
                          color: 'primary.main',
                          mb: 0.5,
                          fontWeight: '600',
                          textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {experience.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {experience.period || experience.duration}
                        {experience.location && ` • ${experience.location}`}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  {experience.description && (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2,
                        color: 'text.secondary',
                        lineHeight: 1.6
                      }}
                    >
                      {experience.description}
                    </Typography>
                  )}

                  {/* Responsibilities */}
                  {experience.responsibilities && experience.responsibilities.length > 0 && (
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: '600',
                          mb: 1.5,
                          color: 'text.primary',
                          textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      >
                      </Typography>
                      <List dense sx={{ pl: 0 }}>
                        {experience.responsibilities.map((responsibility, idx) => (
                          <ListItem
                            key={idx}
                            sx={{
                              py: 0.75,
                              pl: 0,
                              borderRadius: '8px',
                              mb: 0.5,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                '& .MuiListItemText-primary': {
                                  // color: 'primary.main',
                                  paddingLeft: '8px',
                                  fontWeight: '500'
                                },
                                '& .responsibility-bullet': {
                                  color: 'primary.main',
                                  transform: 'scale(1.3)'
                                }
                              }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <FiberManualRecordIcon
                                className="responsibility-bullet"
                                sx={{
                                  fontSize: 8,
                                  color: 'primary.main',
                                  transition: 'all 0.2s ease'
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={responsibility}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.9rem',
                                  color: 'text.secondary',
                                  lineHeight: 1.5,
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>  
  );
};

ExperienceSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      company: PropTypes.string,
      title: PropTypes.string,
      period: PropTypes.string,
      duration: PropTypes.string,
      location: PropTypes.string,
      description: PropTypes.string,
      responsibilities: PropTypes.arrayOf(PropTypes.string),
      logo: PropTypes.string,
      active: PropTypes.bool,
      order: PropTypes.number,
    })
  ),
};

export default ExperienceSection;