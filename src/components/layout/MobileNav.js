// src/components/sections/MobileNav.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

function MobileNav({ sections, activeSection, scrollToSection }) {
  const theme = useTheme();

  return (
    <nav
      className="
        fixed z-50 w-full top-0 bg-white shadow-md
        flex items-center justify-between px-4 py-2
      "
    >
      <Box className="flex gap-4 overflow-x-auto">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <Button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="whitespace-nowrap"
              sx={{
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                fontWeight: isActive ? 'medium' : 'regular',
                position: 'relative',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <Typography variant="body1">{section.title}</Typography>
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '2px',
                  }}
                />
              )}
            </Button>
          );
        })}
      </Box>
    </nav>
  );
}

export default MobileNav;
