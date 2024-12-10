// src/components/sections/ProjectsSection.jsx
import React from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import PropTypes from 'prop-types';

function ProjectsSection({ id, title, content, projects }) {
  console.log('Projects:', projects); // Debugging line

  // Add a defensive check to ensure projects is an array
  if (!Array.isArray(projects)) {
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
        <Typography color="error">No projects available.</Typography>
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
      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto' }}>
                {project.link && (
                  <Button size="small" href={project.link} target="_blank">
                    Learn More
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}

ProjectsSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
};

export default ProjectsSection;
