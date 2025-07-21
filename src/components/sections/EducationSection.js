// src/components/sections/EducationSection.jsx
import React from 'react';
import { Typography, Grid, Box, Avatar, Divider, Chip, useMediaQuery, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

function EducationSection({ id, title, content, educationList = [] }) {
  // Ensure educationList is an array
  const validEducationList = Array.isArray(educationList) ? educationList : [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <section id={id} className="py-16">
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

      {/* Introductory Content */}
      {content && (
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
      )}

      {/* Education List */}
      <Grid container sx={{ maxWidth: isMobile ? '90%' : '65%', margin: 'auto' }}>
        {validEducationList.map((education, index) => (
          <Grid item xs={12} key={education.id || index}>
            {/* Display education item */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: '16px',
                p: 3,
                boxShadow: 2,
                textAlign: 'center',
                mb: 3,
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
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.125rem', md: '1.8rem' },
                    }}
                  >
                    {education.institution}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {education.degree} {education.major && `in ${education.major}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {education.duration || education.years}
                  </Typography>
                  {education.location && (
                    <Typography variant="body2" color="text.secondary">
                      {education.location}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              {/* Educational details/description */}
              {(education.description || education.details) && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {education.description || education.details}
                </Typography>
              )}

              {/* Electives for university level */}
              {education.electives && Array.isArray(education.electives) && education.electives.length > 0 && (
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

            {/* Divider between entries */}
            {index < validEducationList.length - 1 && <Divider sx={{ my: 4 }} />}
          </Grid>
        ))}
      </Grid>
    </section>
  );
}

EducationSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string, // Made optional
  educationList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      institution: PropTypes.string,
      degree: PropTypes.string,
      major: PropTypes.string, // Firebase data uses major field
      duration: PropTypes.string, // New editor field
      years: PropTypes.string, // Firebase data uses years field
      description: PropTypes.string, // New editor field
      details: PropTypes.string, // Firebase data uses details field
      location: PropTypes.string,
      logo: PropTypes.string,
      level: PropTypes.string, // university/school distinction
      electives: PropTypes.arrayOf(PropTypes.string), // Firebase data has electives array
    })
  ),
};

export default EducationSection;
