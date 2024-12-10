import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import content from '../../data/content.json';
import CreativeSectionList from '../sections/CreativeSectionList';

const PortfolioContent = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    setSections(content.sections);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {sections.map((section) => (
        <Box key={section.id} id={section.id} py={5}>
          <Typography variant="h4" color="primary" gutterBottom>
            {section.title}ddd
          </Typography>
          <Typography variant="body1">{section.content}</Typography>
        </Box>
      ))}
      <CreativeSectionList sections={sections} />
    </Container>
  );
};

export default PortfolioContent;
