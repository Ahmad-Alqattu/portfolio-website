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
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';

const pages = [
  { title: 'Home', path: '/' },
];

function ResponsiveNavBar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useAuth();

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
        position="sticky"
        // Use theme background colors instead of fixed color
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
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
              variant="h5"
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Ahmad Luay 
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
              <IconButton
                onClick={handleGitHubClick}
                aria-label="GitHub Profile"
                sx={{ color: theme.palette.text.primary }}
              >
                <GitHubIcon />
              </IconButton>

              <FormControlLabel
  control={
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography 
        onClick={toggleDarkMode} 
        style={{
          cursor: 'pointer',
          transition: 'transform 0.7s ease-out',
          transform: darkMode ? 'rotate(360deg)' : 'rotate(0deg)'
        }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </Typography>
    </Stack>
  }
/>
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
