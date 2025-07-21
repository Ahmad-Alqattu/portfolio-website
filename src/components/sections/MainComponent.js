import React, { useState, useEffect, useCallback } from 'react';
import { useTheme, useMediaQuery, Box, Button, styled } from '@mui/material';
import { useData } from '../../contexts/DataContext';
import IntroSection from './IntroSection';
import SkillsSection from './SkillsSection';
import EducationSection from './EducationSection';
import ProjectsSection from './ProjectsSection';
import CapabilitiesSection from './CapabilitiesSection';
import ExperienceSection from './ExperienceSection';

// Styled components
const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  }
}));

const DesktopNav = styled(Box)(({ theme }) => ({
  position: 'fixed',
  zIndex: 50,
  transition: 'all 300ms',
  width: '100%',
  top: '10vh',
  backgroundColor: 'transparent',
  [theme.breakpoints.up('md')]: {
    width: '20%',
    height: '70vh',
  }
}));

const NavContainer = styled(Box)({
  height: '100%',
  display: 'flex',
  
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
});

const NavItemsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 1)
}));

const NavItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(1.5),
  cursor: 'pointer'
}));

const MainContent = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 4),
  [theme.breakpoints.up('md')]: {
    width: '80%',
    marginLeft: '12%',
    marginTop: 0
  }
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isActive }) => ({
  position: 'relative',
  padding: theme.spacing(1, 2.2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 300ms',
  whiteSpace: 'nowrap',
  fontWeight: isActive ? 500 : 400,
  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
  '&:hover': {
    opacity: 0.8
  }
}));

const IndicatorLine = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isActive }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'translateX(-18px)',
    height: '90%',
    width: '2.5px',
    backgroundColor: isActive ? theme.palette.primary.main : theme.palette.grey[300]
  }
}));

function MainComponent() {
  const { sections, loading, error } = useData();
  const [activeSection, setActiveSection] = useState('intro');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Remove the old fetch logic and use data from context
  // useEffect(() => {
  //   fetch('/data/sectionsData.json')
  //     .then(response => response.json())
  //     .then(data => setSections(data))
  //     .catch(error => console.error('Error loading data:', error));
  // }, []);

  const handleScroll = useCallback(() => {
    let newActiveSection = activeSection;
    for (let section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          newActiveSection = section.id;
          break;
        }
      }
    }
    if (newActiveSection !== activeSection) {
      setActiveSection(newActiveSection);
    }
  }, [sections, activeSection]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Show loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        Loading portfolio data...
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        Error loading portfolio data: {error}
      </Box>
    );
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MainContainer>
      {!isMobile && (
        <DesktopNav>
          <NavContainer>
            <NavItemsContainer>
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <NavItem
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <IndicatorLine isActive={isActive} />
                    <NavButton
                      isActive={isActive}
                      disableRipple
                    >
                      <Box component="span" sx={{ zIndex: 10, position: 'relative' }}>
                        {section.title}
                      </Box>
                      {isActive && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 5,
                            inset: 0,
                            borderRadius: 3 ,
                            bgcolor: 'action.hover'
                          }}
                        />
                      )}
                    </NavButton>
                  </NavItem>
                );
              })}
            </NavItemsContainer>
          </NavContainer>
        </DesktopNav>
      )}

     
      <MainContent>
        {sections.map((section) => {
          switch (section.type) {
            case 'intro':
              return (
                <IntroSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  content={section.content}
                  data={section.data}
                  name={section.name}
                />
              );
            case 'capabilities':
              return (
                <CapabilitiesSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  content={section.content}
                />
              );
            case 'skills':
              return (
                <SkillsSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  content={section.content}
                  scrollIntoView={scrollToSection}
                />
              );
            case 'education':
              return (
                <EducationSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  content={section.content}
                  educationList={section.data.educationList}
                />
              );
            case 'projects':
              return (
                <ProjectsSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  content={section.content}
                  projects={section.data.projects}
                />
              );
            case 'experience':
              return (
                <ExperienceSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  experiences={section.data.experiences}
                />
              );
            default:
              return null;
          }
        })}
      </MainContent>
      
      {/* Small Edit Link */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 1000 
      }}>
        <a
          href="/edit"
          target="_blank"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ✏️ Edit
        </a>
      </div>
    </MainContainer>
  );
}

export default MainComponent;