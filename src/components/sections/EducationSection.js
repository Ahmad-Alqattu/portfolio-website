// src/components/sections/EducationSection.jsx
import React from 'react';
import { Typography, Box, Avatar, Chip, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import SectionHeading from '../ui/SectionHeading';
import { glassCardSx, glassChipSx } from '../ui/glassStyles';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

function EducationSection({ id, title, content, educationList = [] }) {
  // Use educationList as the primary data source
  const validEducationList = Array.isArray(educationList) ? educationList : [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { language, t } = useLanguage();

  return (
    <section id={id} className="py-16">
      {/* Section Title */}
      <SectionHeading sectionId={id}>{localize(title, language)}</SectionHeading>

      {/* Introductory Content */}
      {content && (
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            color: 'text.secondary',
            mb: 6,
            maxWidth: '800px',
            margin: 'auto',
            textAlign: 'center',
          }}
        >
          {localize(content, language)}
        </Typography>
      )}

      {/* Education List */}
      <Box sx={{ maxWidth: isMobile ? '100%' : '860px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {validEducationList
          .filter(education => education.active !== false) // Show only active education items
          .sort((a, b) => (a.order || 999) - (b.order || 999)) // Sort by order
          .map((education, index) => (
            <Box
              key={education.id || index}
              component={prefersReducedMotion ? 'div' : motion.div}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
              sx={{ ...glassCardSx(theme), p: { xs: 2.5, md: 3.5 } }}
            >
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                {education.logo && (
                  <Avatar
                    src={education.logo}
                    alt={`${localize(education.institution, language)} logo`}
                    sx={{ width: 56, height: 56, flexShrink: 0 }}
                    variant="rounded"
                  />
                )}
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.1rem', md: '1.35rem' },
                      lineHeight: 1.3,
                      color: 'text.primary',
                    }}
                  >
                    {localize(education.institution, language)}
                  </Typography>
                  <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.95rem', mt: 0.25 }}>
                    {localize(education.degree, language)} {education.major && `in ${localize(education.major, language)}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {localize(education.duration, language) || localize(education.years, language)}
                    {education.location && ` • ${localize(education.location, language)}`}
                  </Typography>
                </Box>
              </Box>

              {/* Body text lines up with the institution name rather than the
                  card edge, so each entry reads as one text column */}
              <Box sx={{ ml: { xs: 0, md: education.logo ? '76px' : 0 } }}>
                {(education.description || education.details) && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, lineHeight: 1.7 }}>
                    {localize(education.description, language) || localize(education.details, language)}
                  </Typography>
                )}

                {/* Electives for university level */}
                {education.electives && Array.isArray(education.electives) && education.electives.length > 0 && (
                  <Box sx={{ mt: 2.5 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        letterSpacing: '1.2px',
                        textTransform: 'uppercase',
                        color: 'primary.main',
                        mb: 1.25,
                      }}
                    >
                      {t('education.electiveSubjects')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {education.electives.map((subject, idx) => (
                        <Chip
                          key={idx}
                          label={localize(subject, language)}
                          size="small"
                          sx={glassChipSx(theme)}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
      </Box>
    </section>
  );
}

EducationSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string, // Made optional
  educationList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      institution: PropTypes.string,
      degree: PropTypes.string,
      major: PropTypes.string, // Firebase data uses major field
      duration: PropTypes.string, // New editor field
      years: PropTypes.string, // Firebase data uses years field
      description: PropTypes.string, // New editor field
      details: PropTypes.string, // Firebase data uses details field
      location: PropTypes.string,
      logo: PropTypes.string,
      level: PropTypes.string, // university/school distinction
      electives: PropTypes.arrayOf(PropTypes.string), // Firebase data has electives array
    })
  ),
};

export default EducationSection;
