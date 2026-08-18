import React from 'react';
import {
  Typography,
  Grid,
  Chip,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import SectionHeading from '../ui/SectionHeading';
import SkillIcon from '../ui/SkillIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

function SkillsSection({ id, title, content }) {
  const { sections } = useData();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { language } = useLanguage();

  // Get skills data from sections or use fallback
  const getSkillsData = () => {
    const skillsSection = sections.find(s => s.type === 'skills');
    return skillsSection?.data?.skillsList || {
      'Front-End': ['HTML5', 'CSS3', 'JavaScript', 'React', 'Bootstrap'],
      'Back-End': ['javalin', 'springBoot', 'PHP', '.NET Core'],
      'Databases': ['MySQL','MsSQL', 'PostgreSQL', 'Firebase'],
      'Mobile': ['Flutter', 'React Native', 'Android (Java)'],
      "apps and script":['Java-fx','Java','Python',],
      'Tools & Other': ['Git', 'Docker', 'Linux', 'IIS'],
    };
  };

  const skillsList = getSkillsData();
  
  // Convert the object's keys into an array
  const categories = Object.keys(skillsList);

  return (
    <Box id={id} sx={{ py: 4 }}>
      {/* Page Title */}
      <SectionHeading sectionId={id}>{localize(title, language) || 'Skills'}</SectionHeading>

      {/* Optional content description */}
      {content && (
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            color: 'text.secondary',
            mb: 4,
            maxWidth: '80%',
            margin: 'auto',
            textAlign: 'center',
          }}
        >
          {localize(content, language)}
        </Typography>
      )}

      {/* Categories + Chips */}
      <Box sx={{ maxWidth: isMobile? '100%' : '70%', margin: 'auto' }}>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  mb: 2,
                  color: 'primary.main',
                  textAlign: 'center',
                }}
              >
                {category}
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                {skillsList[category].map((skill, idx) => (
                  <Grid key={idx}>
                    <Chip
                      component={prefersReducedMotion ? 'div' : motion.div}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
                      icon={<SkillIcon name={skill} />}
                      label={skill}
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        py: 2,
                        px: 0.5,
                        color: 'text.primary',
                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
                        backdropFilter: 'blur(14px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(14px) saturate(180%)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.8)'}`,
                        boxShadow: isDark
                          ? '0 4px 14px rgba(0,0,0,0.28)'
                          : '0 4px 14px rgba(20,60,30,0.07)',
                        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease, border-color 0.25s ease',
                        // react-icons render as bare <svg fill="currentColor">,
                        // so the colour has to be set on the element itself —
                        // MUI's .MuiChip-icon colour rule alone leaves them black.
                        '& .MuiChip-icon': {
                          color: 'primary.main',
                          fill: 'currentColor',
                          ml: 1,
                        },
                        '& .MuiChip-icon path': {
                          fill: 'currentColor',
                        },
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          borderColor: isDark ? 'rgba(129,199,132,0.45)' : 'rgba(76,175,80,0.4)',
                          boxShadow: isDark
                            ? `0 8px 20px rgba(0,0,0,0.4), 0 0 14px ${theme.palette.primary.main}33`
                            : `0 8px 20px rgba(20,60,30,0.12), 0 0 14px ${theme.palette.primary.main}22`,
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                          transition: 'none',
                          '&:hover': { transform: 'none' },
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default SkillsSection;