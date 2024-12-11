import React from 'react';
import { Typography, Grid, Chip, Box } from '@mui/material';
import PropTypes from 'prop-types';

function SkillsSection({ id, title, content, skillsList }) {
  console.log('Skills List:', skillsList); // Debugging line

  // Check if skillsList is an object with categories
  if (!skillsList || typeof skillsList !== 'object' || Array.isArray(skillsList)) {
    return (
      <section id={id} className="py-16">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
  
            mb: 3,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.25rem',
            color: 'text.secondary',
          }}
        >
          {content}
        </Typography>
        <Typography color="error" sx={{ mt: 2 }}>
          No structured skills available.
        </Typography>
      </section>
    );
  }

  // Render categories and their skills
  const categories = Object.keys(skillsList);

  return (
    <section id={id} className="py-16">
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: '2rem',
          fontWeight: 'bold',
          mb: 3,
          marginLeft: '5%',
          // textAlign:'center',
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '1.25rem',
          color: 'text.secondary',
          mb: 6,
          maxWidth: '700px',
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        {content}
      </Typography>

      <Box sx={{ maxWidth: '700px', margin: 'auto' }}>
        {categories.map((category) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: '1.5rem',
                fontWeight: '500',
                mb: 2,
                color: 'text.primary',
              }}
            >
              {category}
            </Typography>
            <Grid container spacing={2}>
              {skillsList[category].map((skill, index) => (
                <Grid item key={index}>
                  <Chip label={skill} color="primary" variant="outlined" />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </section>
  );
}

SkillsSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  // Now expecting an object of { [category: string]: string[] }
  skillsList: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default SkillsSection;
