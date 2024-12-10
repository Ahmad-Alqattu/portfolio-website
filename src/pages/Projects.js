import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  TextField,
  Box 
} from '@mui/material';

const Projects = ({ isAdmin }) => {
  const projects = [
    { title: 'Project 1', description: 'Description for project 1' },
    { title: 'Project 2', description: 'Description for project 2' },
  ];

  if (isAdmin) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Edit Projects
        </Typography>
        {projects.map((project, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Project Title"
              defaultValue={project.title}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Project Description"
              defaultValue={project.description}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Projects
      </Typography>
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.title}</Typography>
                <Typography color="text.secondary">
                  {project.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;