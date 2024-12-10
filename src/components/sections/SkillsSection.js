// src/components/sections/SkillsSection.jsx
import React from 'react';
import { Typography, Grid, Chip } from '@mui/material';
import PropTypes from 'prop-types';

function SkillsSection({ id, title, content, skillsList }) {
  console.log('Skills List:', skillsList); // Debugging line

  // Add a defensive check to ensure skillsList is an array
  if (!Array.isArray(skillsList)) {
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
        <Typography color="error">No skills available.</Typography>
      </section>
    );
  }

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
          mb: 4,
        }}
      >
        {content}
      </Typography>
      <Grid container spacing={2}>
        {skillsList.map((skill, index) => (
          <Grid item key={index}>
            <Chip label={skill} color="primary" variant="outlined" />
          </Grid>
        ))}
      </Grid>
    </section>
  );
}

SkillsSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  skillsList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SkillsSection;
