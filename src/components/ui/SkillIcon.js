import React from 'react';
import {
  SiReact,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiJavascript,
  SiBootstrap,
  SiOpenjdk,
  SiPython,
  SiSpringboot,
  SiDjango,
  SiDotnet,
  SiPhp,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiFlutter,
  SiAndroid,
  SiGit,
  SiDocker,
  SiLinux,
} from 'react-icons/si';
import { FiDatabase, FiServer, FiCode } from 'react-icons/fi';

// Normalised skill name -> brand icon. Keys are lower-cased and stripped of
// spaces, dots and dashes so "React.js", "react js" and "reactjs" all match.
const iconMap = {
  reactjs: SiReact,
  react: SiReact,
  reactnative: SiReact,
  html5: SiHtml5,
  html: SiHtml5,
  css3: SiCss,
  css: SiCss,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  javascript: SiJavascript,
  js: SiJavascript,
  bootstrap: SiBootstrap,
  java: SiOpenjdk,
  javafx: SiOpenjdk,
  javalin: SiOpenjdk,
  androidjava: SiAndroid,
  python: SiPython,
  springboot: SiSpringboot,
  spring: SiSpringboot,
  django: SiDjango,
  netcore: SiDotnet,
  dotnet: SiDotnet,
  dotnetcore: SiDotnet,
  php: SiPhp,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  mongodb: SiMongodb,
  firebase: SiFirebase,
  flutter: SiFlutter,
  android: SiAndroid,
  git: SiGit,
  docker: SiDocker,
  linux: SiLinux,
  // No official brand glyph in the set — use a descriptive generic instead of
  // silently rendering nothing.
  mssql: FiDatabase,
  microsoftsqlserver: FiDatabase,
  sqlserver: FiDatabase,
  iis: FiServer,
};

// Defensive: skills come from user-edited data and may arrive as a bilingual
// object rather than a string, which would throw on .toLowerCase().
const normalise = (name) =>
  String(name ?? '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[\s._-]/g, '');

function SkillIcon({ name, size = 16 }) {
  const key = normalise(name);
  const Icon = iconMap[key] || FiCode;

  return (
    <Icon
      aria-hidden
      className="shrink-0 fill-current text-brand"
      style={{ width: size, height: size, fontSize: size }}
    />
  );
}

export default SkillIcon;
