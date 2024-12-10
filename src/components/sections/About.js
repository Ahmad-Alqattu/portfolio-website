import React from 'react';
import { Container, Grid, Typography, Avatar, Chip, Box } from '@mui/material';
// 
function About() {
  return (
    <Container id="about" sx={{ padding: '50px 0' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          {/* <Avatar alt="Ahmad Al-Qattu" src={myPhoto} sx={{ width: 150, height: 150, margin: '0 auto' }} /> */}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4">About Me</Typography>assets\logo192.png
          <Typography variant="body1" sx={{ marginY: 2 }}>
            Hi! I'm Ahmad Al-Qattu, a passionate Full-Stack Developer with experience in building web and mobile
            applications using modern technologies such as React, Flutter, and more.
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            {['React', 'JavaScript', 'Python', 'Flutter', 'MySQL'].map((skill) => (
              <Chip key={skill} label={skill} sx={{ margin: 0.5 }} />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;
