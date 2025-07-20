import { createTheme } from '@mui/material/styles';

// Define your colors for light and dark modes in one place
const lightPalette = {
  primary: {
    main: '#4caf50', // A green shade for light mode
  },
  secondary: {
    main: '#ff5722', // A distinct accent color for light mode
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: '#000000',
    secondary: '#121212',
  },
  footer: {
    main: '#F5F5F5',
  }
};

const darkPalette = {
  primary: {
    main: '#81c784', // A lighter green for dark mode
  },
  secondary: {
    main: '#ff8a65', // A distinct accent for dark mode
  },
  background: {
    default: '#121212',
    paper: '#1f1f1f',
  },
  text: {
    primary: '#ffffff',
    secondary: '#aaaaaa',
  },
  footer: {
    main: '#1f1f1f',
  }
};

const baseThemeOptions = {
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

export function createMyTheme(mode) {
  return createTheme({
    ...baseThemeOptions,
    palette: mode === 'dark' ? { mode: 'dark', ...darkPalette } : { mode: 'light', ...lightPalette },
  });
}
