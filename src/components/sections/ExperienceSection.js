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
  useTheme
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';



const ExperienceSection = ({ id, title,educationList}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box id={id} sx={{           maxWidth: isMobile? '100%' : '75%', margin: 'auto', py: 6, }}>

              <Typography variant="h2" component="h2" sx={{           textAlign: 'center', 
fontSize: '2.5rem', fontWeight: 'bold', mb: 4, color: 'primary.main' }}>
      
        {title}
      </Typography>
      
      <Grid container spacing={3}>
        {educationList.map((exp, index) => (
          <Grid item xs={12} key={index}>
            <Paper 
              elevation={3}
              sx={{
                borderRadius: 4, // Increased border radius for Paper
                overflow: 'hidden', // Ensures content doesn't overflow rounded corners
                '&:hover': {
                  boxShadow: 6,
                  transition: 'box-shadow 0.3s ease-in-out'
                }
              }}
            >
              <Card sx={{ borderRadius: 4 }}> {/* Matching border radius for Card */}
                <CardContent sx={{ p: 3 }}> {/* Added more padding */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      mb: 2,
                      p: 1,
                      borderRadius: 2, // Subtle border radius for header area
                      bgcolor: 'background.default'
                    }}
                  >
                    <Box>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                        {exp.title}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ 
                          mt: 0.5,
                          borderRadius: 1 // Subtle border radius for company name
                        }}
                      >
                        {exp.company}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ 
                        px: 2, 
                        py: 0.5, 
                        bgcolor: 'action.hover',
                        borderRadius: 2 // Pill-shaped border radius for date
                      }}
                    >
                      {exp.period}
                    </Typography>
                  </Box>
                  
                  <List sx={{ pl: 1 }}>
                    {exp.responsibilities.map((responsibility, idx) => (
                      <ListItem 
                        key={idx} 
                        sx={{ 
                          py: 0.5,
                          '&:hover': {
                            bgcolor: 'action.hover',
                            borderRadius: 2 // Border radius for list items on hover
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
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>  
  );
};

export default ExperienceSection;