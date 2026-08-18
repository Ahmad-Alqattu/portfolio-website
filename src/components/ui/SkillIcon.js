import React from 'react';
import { Box } from '@mui/material';
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
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';
import CodeIcon from '@mui/icons-material/Code';

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
  mssql: StorageIcon,
  microsoftsqlserver: StorageIcon,
  sqlserver: StorageIcon,
  iis: DnsIcon,
};

const normalise = (name = '') =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[\s._-]/g, '');

function SkillIcon({ name, size = 16 }) {
  const key = normalise(name);
  const Icon = iconMap[key] || CodeIcon;

  return (
    <Box
      component={Icon}
      aria-hidden
      sx={{
        fontSize: size,
        width: size,
        height: size,
        flexShrink: 0,
        color: 'primary.main',
        fill: 'currentColor',
      }}
    />
  );
}

export default SkillIcon;
