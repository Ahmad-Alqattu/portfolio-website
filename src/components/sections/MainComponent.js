// src/components/sections/MainComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import IntroSection from './IntroSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';
import MobileNav from '../layout/MobileNav';
import { Box } from '@mui/material';
import sectionsData from '../../data/sectionsData.json'; // Static import

function MainComponent() {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('intro');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Set sections with static data
    setSections(sectionsData);
    console.log('Sections loaded:', sectionsData);
  }, []);

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  console.log('Current sections:', sections);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Desktop Navigation */}
      {!isMobile && (
        <nav
          className="
            fixed z-50 transition-all duration-300
            md:w-1/5 md:h-screen
            w-full top-0 bg-transparent
          "
          // If you prefer semi-transparent, use inline styles or Tailwind's opacity classes
          // style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
          <div className="h-full flex md:flex-col items-center justify-center">
            <div className="flex md:flex-col gap-4 py-4">
              {sections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <div
                    key={section.id}
                    className="relative md:mb-4"
                    onClick={() => scrollToSection(section.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Desktop indicator line */}
                    <div
                      className="hidden md:block absolute left-0 top-0 -translate-x-4 h-full"
                      style={{
                        width: '2px',
                        backgroundColor: isActive
                          ? theme.palette.primary.main
                          : theme.palette.grey[300],
                      }}
                    />
                    {/* Navigation item */}
                    <button
                      className="
                        relative px-4 py-2 rounded-lg transition-all duration-300
                        hover:opacity-80 whitespace-nowrap
                      "
                      style={{
                        color: isActive
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontWeight: isActive ? 500 : 400,
                        position: 'relative',
                      }}
                    >
                      <span className="relative z-10">{section.title}</span>
                      {isActive && (
                        <div
                          className="absolute inset-0 rounded-lg"
                          style={{ backgroundColor: theme.palette.action.hover }}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          sections={sections}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />
      )}

      {/* Main Content */}
      <main className="w-full md:w-4/5 md:ml-[20%] mt-20 md:mt-0">
        <Box className="px-4">
          {sections.map((section) => {
            switch (section.type) {
              case 'intro':
                return (
                  <IntroSection
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
                    skillsList={section.data.skillsList}
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
              case 'contact':
                return (
                  <ContactSection
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    content={section.content}
                  />
                );
              default:
                return null;
            }
          })}
        </Box>
      </main>
    </div>
  );
}

export default MainComponent;
