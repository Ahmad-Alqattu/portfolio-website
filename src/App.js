import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createMyTheme } from './theme';
import ResponsiveNavBar from './components/layout/ResponsiveNavBar';
import MainComponent from './components/sections/MainComponent';
import About from './components/sections/IntroSection';
import Projects from './components/sections/ProjectsSection';
import Footer from './components/layout/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createMyTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ResponsiveNavBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<MainComponent />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
