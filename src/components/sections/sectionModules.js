import React from 'react';

// Each section is its own chunk. On a prerendered page index.js awaits
// preloadSections() before the first render, so MainComponent gets the real
// components and React's first paint matches the HTML that was already on
// screen; otherwise they stay React.lazy and load on demand.
const loaders = {
  intro: () => import('./IntroSection'),
  capabilities: () => import('./CapabilitiesSection'),
  skills: () => import('./SkillsSection'),
  projects: () => import('./ProjectsSection'),
  education: () => import('./EducationSection'),
  experience: () => import('./ExperienceSection'),
  certificates: () => import('./CertificatesSection'),
};

const lazy = Object.fromEntries(Object.entries(loaders).map(([type, load]) => [type, React.lazy(load)]));
const loaded = {};

export function preloadSections(types = Object.keys(loaders)) {
  return Promise.all(
    types
      .filter((type) => loaders[type])
      .map((type) => loaders[type]().then((m) => {
        loaded[type] = m.default;
      }))
  );
}

export function sectionComponent(type) {
  return loaded[type] || lazy[type];
}
