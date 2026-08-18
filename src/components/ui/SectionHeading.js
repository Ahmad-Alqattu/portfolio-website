import React from 'react';
import { Typography } from '@mui/material';
import { useActiveSection } from '../../contexts/ActiveSectionContext';

// Section titles scale up and gain full color only while their section is the
// one being read. On a long single-page layout that gives one unmistakable
// "you are here" anchor without adding another element to scan.
function SectionHeading({ sectionId, children, sx }) {
  const { activeSection } = useActiveSection();
  const isActive = activeSection === sectionId;

  return (
    <Typography
      variant="h2"
      component="h2"
      sx={{
        textAlign: 'center',
        mb: 4,
        color: isActive ? 'primary.main' : 'text.secondary',
        fontSize: isActive
          ? { xs: '2.4rem', md: '3.4rem' }
          : { xs: '1.9rem', md: '2.4rem' },
        opacity: isActive ? 1 : 0.75,
        transition: 'font-size 0.4s ease, color 0.4s ease, opacity 0.4s ease',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

export default SectionHeading;
