// src/components/sections/EducationSection.jsx
import React from 'react';
import { Typography, Grid, Box, Chip, Avatar, Divider , useMediaQuery,
  useTheme } from '@mui/material';
import PropTypes from 'prop-types';

function EducationSection({ id, title, content, educationList }) {
  // Sort the list so that universities come first, followed by schools
  const sortedEducationList = [...educationList].sort((a, b) => {
    if (a.level === 'university' && b.level !== 'university') return -1;
    if (a.level !== 'university' && b.level === 'university') return 1;
    return 0;
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <section id={id} className="py-16">
      {/* Section Title */}

              <Typography variant="h2" component="h2" sx={{           textAlign: 'center', 
fontSize: '2.5rem', fontWeight: 'bold', mb: 4, color: 'primary.main' }}>
        {title}
      </Typography>

      {/* Introductory Content */}
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1.125rem', md: '1.25rem' },
          color: 'text.secondary',
          mb: 6,
          maxWidth: '800px',
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        {content}
      </Typography>

      {/* Education List */}
      <Grid container  sx={{           maxWidth: isMobile? '90%' : '65%', margin: 'auto' }}>
        {sortedEducationList.map((education, index) => (
          <Grid item xs={12} key={index}>
            {education.level === 'university' ? (
              // University information displayed elegantly and centered
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: '16px',
                  p: 3,
                  boxShadow: 2,
                  textAlign: 'center',
                }}
              >
                <Grid container spacing={2} alignItems="center" justifyContent="center" textAlign="center">
                  {education.logo && (
                    <Grid item>
                      <Avatar
                        src={education.logo}
                        alt={`${education.institution} logo`}
                        sx={{ width: 60, height: 60 }}
                        variant="rounded"
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold',          fontSize: { xs: '1.125rem', md: '1.8rem' },

                    }}>
                    
                      {education.institution}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {education.degree} in {education.major}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {education.years}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Optional details can be shown here if needed */}
                {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {education.details}
                </Typography> */}

                {/* Elective subjects */}
                {education.electives && education.electives.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      Elective Subjects for Major:
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                      {education.electives.map((subject, idx) => (
                        <Grid item key={idx}>
                          <Chip label={subject} color="primary" variant="outlined" />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            ) : (
              // School information displayed simply and centered
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                {education.logo && (
                  <Avatar
                    src={education.logo}
                    alt={`${education.institution} logo`}
                    sx={{ width: 80, height: 80, mb: 2 }}
                    variant="rounded"
                  />
                )}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {education.institution}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {education.degree} in {education.major}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {education.years}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {education.details}
                </Typography>
              </Box>
            )}

            {/* Divider between entries */}
            {index < sortedEducationList.length - 1 && <Divider sx={{ my: 4 }} />}
          </Grid>
        ))}
      </Grid>
    </section>
  );
}

EducationSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  educationList: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.string.isRequired, // 'school' or 'university'
      institution: PropTypes.string.isRequired,
      degree: PropTypes.string.isRequired,
      major: PropTypes.string.isRequired,
      years: PropTypes.string.isRequired,
      logo: PropTypes.string,
      electives: PropTypes.arrayOf(PropTypes.string),
      details: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EducationSection;
