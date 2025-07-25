import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';

// Define the "What Can I Do?" list
const capabilities = [
  {
    title: 'Build Robust Applications',
    description:
      'I develop stable and efficient services and applications, including JavaFX-based desktop apps and Python apps—scripts for data extraction and classification.',
  },
  {
    title: 'Create Web Services & APIs',
    description:
      'I design reliable and scalable RESTful and SOAP-based APIs using frameworks like Spring Boot, Javalin, .NET Core, and PHP.',
  },
  {
    title: 'Develop Mobile Experiences',
    description:
      'I deliver smooth, intuitive, and responsive mobile solutions with Flutter, hands-on React Native, and native Android (Java).',
  },
  {
    title: 'Work with Databases & Cloud Services',
    description:
      'I manage and secure data using MySQL, PostgreSQL, Microsoft SQL Server, and Firebase (real-time DB, Firestore, and cloud functions).',
  },
  {
    title: 'Front-End Development',
    description:
      'I craft clean, responsive, and user-friendly interfaces using HTML5, CSS3, HTMX, JavaScript, React.js, and Bootstrap.',
  },
  {
    title: 'Optimize with Git & DevOps Tools',
    description:
      'I streamline deployment and collaboration using Git, Docker, Linux environments, and hosting platforms such as IIS on Windows.',
  },
];

function CapabilitiesSection({ id, title, data, content }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Use data from props or fall back to hardcoded capabilities
  const capabilitiesData = data?.capabilities || capabilities.map(cap => cap.title);
  const sectionTitle = title || 'What Can I Do?';
  const sectionContent = content || '';

  // Create capability objects from data
  const capabilityItems = capabilitiesData.map((capability, index) => {
    if (typeof capability === 'string') {
      // If it's just a string, use the original hardcoded descriptions
      const originalCap = capabilities.find(cap => cap.title === capability) || capabilities[index];
      return {
        title: capability,
        description: originalCap?.description || 'Professional capability in this area.'
      };
    }
    return capability; // If it's already an object with title and description
  });

  return (
    <Box  id={id} sx={{ py: 4 }}>
      {/* Page Title */}

              <Typography variant="h2" component="h2" sx={{           textAlign: 'center', 
fontSize: '2.5rem', fontWeight: 'bold', mb: 4, color: 'primary.main' }}>
        {sectionTitle}
      </Typography>

      {sectionContent && (
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, maxWidth: '800px', mx: 'auto' }}>
          {sectionContent}
        </Typography>
      )}

      {/* Grid of Cards */}
      <Box sx={{          maxWidth: isMobile? '100%' : '80%', margin: 'auto' }}>
        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {capabilityItems.map((cap, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 2,
                  borderRadius: 2,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}
                  >
                    {cap.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                  >
                    {cap.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default CapabilitiesSection;
