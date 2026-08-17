import React from 'react';
import {
  AppBar,
  Box,
  Typography,
  Container,
  Button,
  IconButton,
  Stack,
  CssBaseline,
  Tooltip,
  useScrollTrigger,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

const pages = [
  { title: 'Home', path: '/' },
];

function ResponsiveNavBar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const isDark = theme.palette.mode === 'dark';
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  const onPageClick = (path) => {
    navigate(path);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/Ahmad-Alqattu', '_blank');
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        // Glassmorphism header: translucent + blur, matching the glass style
        // used by the mobile bottom nav and back-to-top button
        sx={{
          // Keep the tint opaque enough (and saturation low) so colored content
          // scrolling underneath does not bloom into visible color blobs
          backgroundColor: isDark
            ? `rgba(20, 20, 20, ${scrolled ? 0.78 : 0.62})`
            : `rgba(255, 255, 255, ${scrolled ? 0.82 : 0.68})`,
          backdropFilter: 'blur(18px) saturate(115%)',
          WebkitBackdropFilter: 'blur(18px) saturate(115%)',
          borderBottom: isDark
            ? '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: scrolled
            ? isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
              : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            : 'none',
          color: theme.palette.text.primary,
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 1 }}
          >
            {/* Left side: Brand */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Ahmad Luay Al-Qattu
            </Typography>

            {/* Center: Desktop Nav Links */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                gap: 2,
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.title}
                  onClick={() => onPageClick(page.path)}
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* Right side: GitHub and Dark Mode Toggle */}
            <Stack direction="row" spacing={1} alignItems="center">
              {/* GitHub Icon */}
              <Tooltip title="GitHub Profile">
                <IconButton
                  onClick={handleGitHubClick}
                  aria-label="GitHub Profile"
                  sx={{ color: theme.palette.text.primary }}
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>

              {/* Dark / Light mode toggle */}
              <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark mode"
                  sx={{
                    color: theme.palette.text.primary,
                    transition: 'transform 0.7s ease-out, color 0.3s ease',
                    transform: darkMode ? 'rotate(360deg)' : 'rotate(0deg)',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                </IconButton>
              </Tooltip>
                      {/* Mobile Menu Icon - only shows on small screens */}
              {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  aria-label="Open navigation menu"
                  sx={{ color: theme.palette.text.primary }}
                >
                  <MenuIcon />
                </IconButton>
              </Box> */}
            </Stack>
          </Stack>

          {/* Mobile Dropdown Menu
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page.title} onClick={() => onPageClick(page.path)}>
                <Typography variant="h6" align="center">
                  {page.title}
                </Typography>
              </MenuItem>
            ))}
          </Menu> */}
        </Container>
      </AppBar>
    </>
  );
}

export default ResponsiveNavBar;
