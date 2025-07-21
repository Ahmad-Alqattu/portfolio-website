import React from 'react';
import {
  Typography,
  Grid,
  Chip,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useData } from '../../contexts/DataContext';

// Optional color mapping for your Chips
const categoryColors = {
  'Front-End': 'primary',
  'Back-End': 'secondary',
  'Databases': 'success',
  'Mobile': 'info',
  'Tools & Other': 'warning',
  'apps and script': 'secondary',
};

function SkillsSection({ id, title, content }) {
  const { sections } = useData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get skills data from sections or use fallback
  const getSkillsData = () => {
    const skillsSection = sections.find(s => s.type === 'skills');
    return skillsSection?.data?.skillsList || {
      'Front-End': ['HTML5', 'CSS3', 'JavaScript', 'React', 'Bootstrap'],
      'Back-End': ['javalin', 'springBoot', 'PHP', '.NET Core'],
      'Databases': ['MySQL','MsSQL', 'PostgreSQL', 'Firebase'],
      'Mobile': ['Flutter', 'React Native', 'Android (Java)'],
      "apps and script":['Java-fx','Java','Python',],
      'Tools & Other': ['Git', 'Docker', 'Linux', 'IIS'],
    };
  };

  const skillsList = getSkillsData();
  
  // Convert the object's keys into an array
  const categories = Object.keys(skillsList);

  return (
    <Box id={id} sx={{ py: 4 }}>
      {/* Page Title */}
      <Typography variant="h2" component="h2" sx={{           
        textAlign: 'center', 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        mb: 4, 
        color: 'primary.main' 
      }}>
        {title || 'Skills'}
      </Typography>

      {/* Optional content description */}
      {content && (
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            color: 'text.secondary',
            mb: 4,
            maxWidth: '80%',
            margin: 'auto',
            textAlign: 'center',
          }}
        >
          {content}
        </Typography>
      )}

      {/* Categories + Chips */}
      <Box sx={{ maxWidth: isMobile? '100%' : '70%', margin: 'auto' }}>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  mb: 2,
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                {category}
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                {skillsList[category].map((skill, idx) => (
                  <Grid item key={idx}>
                    <Chip
                      label={skill}
                      color={categoryColors[category] || 'default'}
                      variant="outlined"
                      sx={{
                        fontSize: '0.875rem',
                        padding: '6px 12px',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default SkillsSection;