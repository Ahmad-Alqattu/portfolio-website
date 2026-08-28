import React from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

// Tailwind v4 emits its utilities inside a cascade layer, and unlayered CSS
// always beats layered CSS regardless of specificity. `enableCssLayer` moves
// Material UI's emotion output into an `mui` layer, and the layer order below
// puts it ahead of `utilities` so Tailwind classes can override MUI styles.
root.render(
  <StyledEngineProvider enableCssLayer>
    <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
    <App />
  </StyledEngineProvider>
);
