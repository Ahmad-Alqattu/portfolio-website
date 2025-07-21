import React from 'react';
import PropTypes from 'prop-types';
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
  useTheme
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const ExperienceSection = ({ id, title, experiences = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Ensure experiences is an array
  const validExperiences = Array.isArray(experiences) ? experiences : [];
  
  return (
    <Box id={id} sx={{ maxWidth: isMobile ? '100%' : '75%', margin: 'auto', py: 6 }}>
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
      
      <Grid container spacing={3}>
        {validExperiences.map((exp, index) => (
          <Grid item xs={12} key={exp.id || index}>
            <Paper 
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 6,
                  transition: 'box-shadow 0.3s ease-in-out'
                }
              }}
            >
              <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      mb: 2,
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'background.default'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Company Logo */}
                      {exp.logo && (
                        <Box
                          component="img"
                          src={exp.logo.startsWith('http') ? exp.logo : `/${exp.logo}`}
                          alt={`${exp.company} logo`}
                          sx={{
                            width: 48,
                            height: 48,
                            objectFit: 'contain',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.300',
                            p: 0.5
                          }}
                        />
                      )}
                      <Box>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                          {exp.title}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color="text.secondary"
                          sx={{ 
                            mt: 0.5,
                            borderRadius: 1
                          }}
                        >
                          {exp.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ 
                        px: 2, 
                        py: 0.5, 
                        bgcolor: 'action.hover',
                        borderRadius: 2
                      }}
                    >
                      {exp.duration || exp.period}
                    </Typography>
                  </Box>
                  
                  {/* Experience description - handle both description and responsibilities */}
                  {(exp.description || exp.responsibilities) && (
                    <Box sx={{ mt: 2 }}>
                      {exp.description ? (
                        // If description is a string, display it as text
                        <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                          {exp.description}
                        </Typography>
                      ) : exp.responsibilities && Array.isArray(exp.responsibilities) ? (
                        // If responsibilities is an array, display as list
                        <List sx={{ pl: 1 }}>
                          {exp.responsibilities.map((responsibility, idx) => (
                            <ListItem 
                              key={idx} 
                              sx={{ 
                                py: 0.5,
                                '&:hover': {
                                  bgcolor: 'action.hover',
                                  borderRadius: 2
                                }
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 25 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={responsibility}
                                primaryTypographyProps={{
                                  variant: 'body1',
                                  color: 'text.primary'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : null}
                    </Box>
                  )}
                  
                  {/* Location */}
                  {exp.location && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mt: 1, fontStyle: 'italic' }}
                    >
                      📍 {exp.location}
                    </Typography>
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
      title: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      duration: PropTypes.string, // New field from editor
      period: PropTypes.string, // Legacy field for backward compatibility
      description: PropTypes.string, // New field from editor
      responsibilities: PropTypes.arrayOf(PropTypes.string), // Legacy field for backward compatibility
      location: PropTypes.string,
      logo: PropTypes.string,
    })
  ),
};

export default ExperienceSection;
