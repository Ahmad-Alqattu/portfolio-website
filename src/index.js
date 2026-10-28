import React from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import App from './App';
import { preloadSections } from './components/sections/sectionModules';
import './index.css';

const container = document.getElementById('root');

// Tailwind v4 emits its utilities inside a cascade layer, and unlayered CSS
// always beats layered CSS regardless of specificity. `enableCssLayer` moves
// Material UI's emotion output into an `mui` layer, and the layer order below
// puts it ahead of `utilities` so Tailwind classes can override MUI styles.
const render = () =>
  createRoot(container).render(
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <App />
    </StyledEngineProvider>
  );

// A prerendered page already shows its content. Load the section chunks it
// uses first, so React's first render replaces that HTML with the same
// content rather than a loading skeleton.
if (container.hasChildNodes() && Array.isArray(window.__INITIAL_DATA__)) {
  const types = [...new Set(window.__INITIAL_DATA__.map((s) => s.type))];
  preloadSections(types).then(render, render);
} else {
  render();
}
