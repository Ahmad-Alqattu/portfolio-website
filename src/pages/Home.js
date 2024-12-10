// pages/Home.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to My Portfolio
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Full Stack Developer
        </Typography>
      </Box>
    </Container>
  );
};
export default Home;
