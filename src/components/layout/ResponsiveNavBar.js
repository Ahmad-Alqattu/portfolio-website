import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Typography,
  IconButton,
  Stack,
  CssBaseline,
  Tooltip,
  useScrollTrigger,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { publicSections } from '../../seo/site';
import { useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useActiveSection } from '../../contexts/ActiveSectionContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

function ResponsiveNavBar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const condensed = useScrollTrigger({ disableHysteresis: true, threshold: 40 });
  const [progress, setProgress] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { activeSection } = useActiveSection();
  const { sections } = useData();
  const { language, setLanguage, t, localizedPath } = useLanguage();

  const navSections = publicSections(sections || []);

  // Mobile has no persistently-visible section list (unlike the desktop
  // sidebar), so once the user has scrolled past the intro, swap the owner
  // name for the section they're currently reading — one calm, stable label
  // instead of requiring them to open the menu to check their position.
  const currentSectionTitle = localize(navSections.find((s) => s.id === activeSection)?.title, language);
  const showSectionTitle = isMobile && condensed && Boolean(currentSectionTitle);

  const pathForSection = (section) =>
    localizedPath((section.type || '').toLowerCase() === 'intro' ? '/about' : `/${section.id}`);

  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/Ahmad-Alqattu', '_blank');
  };

  const iconButtonSx = {
    color: theme.palette.text.primary,
    transition: 'color 0.3s ease, background-color 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
    },
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          pt: '12px',
          px: 2,
          transition: `padding 0.45s ${EASE}`,
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <Box
          sx={{
            width: 'fit-content',
            maxWidth: '100%',
            mx: 'auto',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '999px',
            color: theme.palette.text.primary,
            backgroundColor: isDark
              ? `rgba(22, 22, 22, ${condensed ? 0.6 : 0.42})`
              : `rgba(255, 255, 255, ${condensed ? 0.62 : 0.45})`,
            backgroundImage: isDark
              ? 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.7)',
            boxShadow: [
              isDark
                ? 'inset 0 1px 0 rgba(255,255,255,0.22)'
                : 'inset 0 1px 0 rgba(255,255,255,0.85)',
              condensed
                ? isDark
                  ? '0 14px 36px rgba(0,0,0,0.5)'
                  : '0 8px 30px rgba(20,60,30,0.12)'
                : isDark
                  ? '0 8px 24px rgba(0,0,0,0.35)'
                  : '0 6px 20px rgba(20,60,30,0.07)',
            ].join(', '),
            transition: [
              `background-color 0.45s ${EASE}`,
              `border-color 0.45s ${EASE}`,
              `box-shadow 0.45s ${EASE}`,
            ].join(', '),
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 1, md: 2 }}
            sx={{
              px: { xs: 2, md: 3 },
              py: condensed ? 0.75 : 1,
              minHeight: 44,
              transition: `padding 0.45s ${EASE}`,
            }}
          >
            <Typography
              onClick={() => navigate(localizedPath('/'))}
              sx={{
                whiteSpace: 'nowrap',
                fontWeight: 700,
                cursor: 'pointer',
                color: showSectionTitle ? 'text.primary' : 'primary.main',
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                transition: 'color 0.3s ease',
                '&:hover': { opacity: 0.8 },
              }}
            >
              {showSectionTitle ? currentSectionTitle : 'Ahmad Al-Qattu'}
            </Typography>

            {!isMobile && navSections.length > 0 && (
              <>
                <Box sx={{ width: '1px', height: 14, bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(20,40,30,0.15)' }} />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {navSections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <Box
                        key={section.id}
                        component={RouterLink}
                        to={pathForSection(section)}
                        sx={{
                          display: 'inline-block',
                          textDecoration: 'none',
                          position: 'relative',
                          cursor: 'pointer',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '999px',
                          whiteSpace: 'nowrap',
                          fontSize: '0.86rem',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'primary.main' : 'text.secondary',
                          bgcolor: isActive
                            ? isDark
                              ? 'rgba(129,199,132,0.16)'
                              : 'rgba(76,175,80,0.12)'
                            : 'transparent',
                          // color/background-color only — animating font-size
                          // forces a layout reflow of the whole nav bar on
                          // every frame, which is what made this feel janky
                          // on desktop (mobile never renders this list at all).
                          transition: 'color 0.25s ease, background-color 0.25s ease',
                          '@media (prefers-reduced-motion: reduce)': {
                            transition: 'none',
                          },
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {localize(section.title, language)}
                      </Box>
                    );
                  })}
                </Stack>
                <Box sx={{ width: '1px', height: 14, bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(20,40,30,0.15)' }} />
              </>
            )}

            <Stack direction="row" spacing={0} alignItems="center">
              <Tooltip title={t('nav.githubProfile')}>
                <IconButton
                  onClick={handleGitHubClick}
                  aria-label={t('nav.githubProfile')}
                  size="small"
                  sx={iconButtonSx}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Language switch: bare EN / AR labels, no icon. Both codes stay
                  visible so the choice is obvious instead of guessing what the
                  single label means */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.25}
                role="group"
                aria-label={t('nav.switchLanguage')}
                sx={{
                  mx: 0.5,
                  px: 0.4,
                  py: 0.2,
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(20,40,30,0.12)',
                }}
              >
                {['en', 'ar'].map((code) => {
                  const isActive = language === code;
                  return (
                    <Box
                      key={code}
                      component="button"
                      type="button"
                      onClick={() => setLanguage(code)}
                      aria-pressed={isActive}
                      lang={code}
                      sx={{
                        border: 0,
                        background: 'none',
                        cursor: 'pointer',
                        px: 0.75,
                        py: 0.25,
                        borderRadius: '999px',
                        fontFamily: 'inherit',
                        fontSize: '0.75rem',
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: '0.04em',
                        lineHeight: 1.4,
                        color: isActive ? 'primary.main' : 'text.secondary',
                        bgcolor: isActive
                          ? isDark
                            ? 'rgba(129,199,132,0.16)'
                            : 'rgba(76,175,80,0.12)'
                          : 'transparent',
                        transition: 'color 0.25s ease, background-color 0.25s ease',
                        '&:hover': { color: 'primary.main' },
                        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                      }}
                    >
                      {code.toUpperCase()}
                    </Box>
                  );
                })}
              </Stack>

              <Tooltip title={darkMode ? t('nav.switchToLight') : t('nav.switchToDark')}>
                <IconButton
                  onClick={toggleDarkMode}
                  aria-label={t('nav.switchToDark')}
                  size="small"
                  sx={{
                    ...iconButtonSx,
                    transition: 'transform 0.7s ease-out, color 0.3s ease',
                    transform: darkMode ? 'rotate(360deg)' : 'rotate(0deg)',
                  }}
                >
                  {darkMode ? (
                    <DarkModeOutlinedIcon fontSize="small" />
                  ) : (
                    <LightModeOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Reading progress for the single-page layout */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              height: '2px',
              width: `${progress * 100}%`,
              backgroundColor: theme.palette.primary.main,
              opacity: progress > 0.005 ? 0.75 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          />
        </Box>
      </AppBar>
    </>
  );
}

export default ResponsiveNavBar;
