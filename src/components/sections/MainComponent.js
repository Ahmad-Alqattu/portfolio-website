import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import GlobalStyles from '@mui/material/GlobalStyles';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuIcon from '@mui/icons-material/Menu';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import LazyLoad from 'react-lazyload';
import { motion } from 'framer-motion';
const IntroSection = React.lazy(() => import('./IntroSection'));
const SkillsSection = React.lazy(() => import('./SkillsSection'));
const ProjectsSection = React.lazy(() => import('./ProjectsSection'));
const CapabilitiesSection = React.lazy(() => import('./CapabilitiesSection'));
const EducationSection = React.lazy(() => import('./EducationSection'));
const ExperienceSection = React.lazy(() => import('./ExperienceSection'));
const CertificatesSection = React.lazy(() => import('./CertificatesSection'));
import { EnhancedPageSkeleton } from '../ui/EnhancedPageSkeleton';
import { useNavigate, useParams } from 'react-router-dom';

// Custom Scrollbar Styles
const CustomScrollbarStyles = () => {
  const theme = useTheme();
  
  return (
    <GlobalStyles
      styles={{
        /* Custom Scrollbar for Webkit browsers (Chrome, Safari, Edge) */
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f1f1f1',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb': {
          background: theme.palette.primary.main,
          borderRadius: '4px',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            background: theme.palette.primary.dark,
          },
        },
        '::-webkit-scrollbar-thumb:active': {
          background: theme.palette.primary.dark,
        },
        '::-webkit-scrollbar-corner': {
          background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f1f1f1',
        },
        
        /* Custom Scrollbar for Firefox */
        'html': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.primary.main} ${theme.palette.mode === 'dark' ? '#1a1a1a' : '#f1f1f1'}`,
          overflowX: 'hidden',
        },
        'body': {
          overflowX: 'hidden',
          width: '100%',
          margin: 0,
          padding: 0,
        },
        
        /* Smooth scrolling for the entire page */
        'html, body': {
          scrollBehavior: 'auto', // We'll handle smooth scrolling manually
        },
        
        /* Custom styles for scrollable containers */
        '.custom-scroll': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.main,
            borderRadius: '3px',
            opacity: 0.7,
            '&:hover': {
              opacity: 1,
              background: theme.palette.primary.dark,
            },
          },
        },
      }}
    />
  );
};

// Styled components
const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden',
  width: '100%',
  minHeight: '100vh',
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
  maxWidth: '100vw',
  overflowX: 'hidden',
  padding: theme.spacing(1, 2),
  paddingBottom: theme.spacing(12), // Extra space for mobile bottom nav
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1, 4),
    paddingBottom: theme.spacing(12),
  },
  [theme.breakpoints.up('md')]: {
    width: '80%',
    marginLeft: '12%',
    marginTop: 0,
    paddingBottom: theme.spacing(4), // Normal padding on desktop
  }
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isActive }) => ({
  position: 'relative',
  padding: theme.spacing(0.7, 2.2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 300ms',
  whiteSpace: 'nowrap',
  fontWeight: isActive ? 500 : 400,
  fontSize: isActive ? '1.05rem' : '0.9rem',
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

// Mobile Bottom Navigation Components
const MobileBottomNav = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'show',
})(({ theme, show }) => ({
  position: 'fixed',
  bottom: show ? '16px' : '-80px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(18, 18, 18, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.15)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.2)',
  padding: theme.spacing(1, 2),
  transition: 'bottom 0.3s ease-in-out',
  display: 'none',
  maxWidth: 'calc(100vw - 32px)',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
  },
}));

const MobileNavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const MobileNavIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isActive }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '16px',
  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: isActive 
    ? theme.palette.primary.main + '20' 
    : 'transparent',
  border: isActive 
    ? `2px solid ${theme.palette.primary.main}` 
    : '2px solid transparent',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '30',
    color: theme.palette.primary.main,
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

// BackToTop Component
const BackToTopButton = ({ show }) => {
  const theme = useTheme();

  const scrollToTop = () => {
    // Use custom smooth scroll with 1.5s duration
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds
    
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    
    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  return (
    <Zoom in={show}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 40,
          height: 40,
        }}
      >
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          sx={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
            filter: 'blur(18px)',
            opacity: theme.palette.mode === 'dark' ? 0.3 : 0.35,
            zIndex: -1,
          }}
        />
        <Fab
          onClick={scrollToTop}
          size="medium"
          aria-label="back to top"
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(20, 20, 20, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px) saturate(180%)',
            WebkitBackdropFilter: 'blur(15px) saturate(180%)',
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.3)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

// Function to get icon for each section


function MainComponent() {
  const { sections, loading, error } = useData();
  const { currentUser, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState('');
  const [showMobileBottomNav, setShowMobileBottomNav] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navTimeout, setNavTimeout] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { sectionId } = useParams();

  const routeAliasToSectionId = (alias) => {
    const a = (alias || '').toLowerCase();
    if (a === 'about' || a === 'home') {
      const intro = sections.find((s) => (s.type || '').toLowerCase() === 'intro');
      return intro ? intro.id : alias;
    }
    return alias;
  };

  const displayPathForSection = (section) => {
    if ((section.type || '').toLowerCase() === 'intro') return '/about';
    return `/${section.id}`;
  };

  // Initial section detection on mount
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      const firstSection = sections[0];
      if (firstSection) {
        setActiveSection(firstSection.id);
      }
    }
  }, [sections, activeSection]);

  // Helper: try scrolling after content mounts
  const scrollToSectionWhenReady = (targetId, attempts = 0) => {
    const el = document.getElementById(targetId);
    if (el) {
      scrollToSection(targetId);
      return;
    }
    if (attempts < 30) {
      setTimeout(() => scrollToSectionWhenReady(targetId, attempts + 1), 100);
    }
  };

  // When routed to /:sectionId, scroll into view once sections render
  useEffect(() => {
    if (!sectionId) return;
    const targetId = routeAliasToSectionId(sectionId);
    const exists = sections.some((s) => s.id === targetId);
    if (!exists) return;
    scrollToSectionWhenReady(targetId);
  }, [sectionId, sections]);
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Handle mobile bottom navigation visibility
    if (isMobile) {
      if (currentScrollY > 100) { // Show after scrolling 100px
        setShowMobileBottomNav(true);
        
        // Clear existing timeout
        if (navTimeout) {
          clearTimeout(navTimeout);
        }
        
        // Set new timeout to hide after 3 seconds of no scrolling
        const newTimeout = setTimeout(() => {
          setShowMobileBottomNav(false);
          }, 3000);
          setNavTimeout(newTimeout);
      } else {
        // Near top - hide navigation
        setShowMobileBottomNav(false);
        if (navTimeout) {
          clearTimeout(navTimeout);
          setNavTimeout(null);
        }
      }
      setLastScrollY(currentScrollY);
    }
    
    // Handle active section detection - improved logic
    let newActiveSection = activeSection;
    let closestSection = null;
    let closestDistance = Infinity;
    
    for (let section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const centerY = window.innerHeight / 2;
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - centerY);
        
        // Check if section is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section.id;
          }
        }
      }
    }
    
    if (closestSection && closestSection !== activeSection) {
      setActiveSection(closestSection);
    }

    setShowBackToTop(currentScrollY > 400);
  }, [sections, activeSection, isMobile, lastScrollY, navTimeout]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up timeout on unmount
      if (navTimeout) {
        clearTimeout(navTimeout);
      }
    };
  }, [handleScroll, navTimeout]);

  // Show loading state
  if (loading) {
    return <EnhancedPageSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        Error loading portfolio data: {error}
      </Box>
    );
  }

  // Filter out footerAndLinks from navigation (it will be rendered separately)
  const filteredSections = sections.filter(section => section.type !== 'footerAndLinks');
  
  // Sort sections by order
  const sortedSections = filteredSections.sort((a, b) => (a.order || 999) - (b.order || 999));

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetPosition = element.offsetTop - 100; // Offset for navbar
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const startTime = performance.now();
      const duration = 1500; // 1.5 seconds
      
      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };
      
      const animateScroll = (currentTime) => {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  };

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <CustomScrollbarStyles />
      
      <MainContainer>
      {!isMobile && (
        <DesktopNav>
          <NavContainer>
            <NavItemsContainer>
              {sortedSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <NavItem
                    key={section.id}
                    onClick={() => navigate(displayPathForSection(section))}
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

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <>
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              width: 56,
              height: 56,
            }}
          >
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              sx={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                filter: 'blur(18px)',
                opacity: theme.palette.mode === 'dark' ? 0.3 : 0.35,
                zIndex: -1,
              }}
            />
            <Fab
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(20, 20, 20, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <MenuIcon />
            </Fab>
          </Box>
          <Modal
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            aria-labelledby="mobile-menu-title"
            aria-describedby="mobile-menu-description"
            disableScrollLock={false}
            keepMounted={false}
            sx={{
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(2px)'
              }
            }}
          >
            <Box sx={{
              position: 'absolute',
              bottom: '80px',
              right: '16px',
              width: 220,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(20, 20, 20, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(15px) saturate(180%)',
              WebkitBackdropFilter: 'blur(15px) saturate(180%)',
              border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              p: 1.5,
              outline: 'none',
              '&:focus': {
                outline: 'none'
              }
            }}>
              <List>
                  {sortedSections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <ListItem
                        key={section.id} 
                        onClick={() => {
                          navigate(displayPathForSection(section));
                          setMobileMenuOpen(false);
                        }}
                        sx={{
                            borderRadius: '8px',
                            mb: 0.5,
                            bgcolor: 'transparent',
                            border: isActive ? '2px solid' : '1px solid transparent',
                            borderColor: isActive ? 'primary.main' : 'transparent',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              borderColor: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.2)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                      >
                        <ListItemText 
                           primary={section.title} 
                           sx={{
                             '& .MuiListItemText-primary': {
                               fontSize: '0.9rem',
                               fontWeight: isActive ? 600 : 500,
                               color: isActive ? 'primary.main' : 'text.primary'
                             }
                           }}
                         />
                      </ListItem>
                    );
                  })}
              </List>
            </Box>
          </Modal>
        </>
      )}

     
      <MainContent>
        <React.Suspense fallback={<EnhancedPageSkeleton />}>
          {sortedSections.map((section) => {
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
                    data={section.data}
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
                    educationList={section.data.educationList || section.data.educations || []}
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

              case 'certificates':
                return (
                  <CertificatesSection
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    content={section.content}
                    data={section.data}
                  />
                );
              default:
                return null;
            }
          })}
        </React.Suspense>
      </MainContent>
      
      {/* Small Edit Link - Only show for authenticated admin */}
      {currentUser && isAdmin && (
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          left: '20px', 
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
      )}
      
      {/* Back to Top Button */}
      {!isMobile && <BackToTopButton show={showBackToTop} />}
    </MainContainer>
    </>
  );
}

export default MainComponent;