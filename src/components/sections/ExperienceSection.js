import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PropTypes from 'prop-types';
import SectionHeading from '../ui/SectionHeading';
import { glassCardSx } from '../ui/glassStyles';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

const ExperienceSection = ({ id, title, experiences = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { language } = useLanguage();

  return (
    <Box id={id} sx={{ maxWidth: isMobile ? '100%' : '860px', mx: 'auto', py: 6 }}>
      {/* Section Title */}
      <SectionHeading sectionId={id}>{localize(title, language)}</SectionHeading>

      {/* Experiences List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {experiences
          .filter(experience => experience.active !== false)
          .sort((a, b) => (a.order || 999) - (b.order || 999))
          .map((experience, index) => (
            <Box
              key={experience.id || index}
              component={prefersReducedMotion ? 'div' : motion.div}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
              sx={{ ...glassCardSx(theme), p: { xs: 2.5, md: 3.5 } }}
            >
                  {/* Company Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 2 }}>
                    {experience.logo && (
                      <Avatar
                        src={experience.logo}
                        alt={`${localize(experience.company, language)} logo`}
                        sx={{ width: 56, height: 56, flexShrink: 0 }}
                        variant="rounded"
                      />
                    )}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1.1rem', md: '1.35rem' },
                          lineHeight: 1.3,
                          color: 'text.primary',
                        }}
                      >
                        {localize(experience.company, language)}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'primary.main',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          mt: 0.25,
                        }}
                      >
                        {localize(experience.title, language)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {localize(experience.period, language) || localize(experience.duration, language)}
                        {experience.location && ` • ${localize(experience.location, language)}`}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Body text lines up with the company name rather than the
                      card edge, so each entry reads as one text column */}
                  <Box sx={{ ml: { xs: 0, md: experience.logo ? '76px' : 0 } }}>
                    {experience.description && (
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 1.5,
                          color: 'text.secondary',
                          lineHeight: 1.7
                        }}
                      >
                        {localize(experience.description, language)}
                      </Typography>
                    )}

                    {/* Responsibilities */}
                    {experience.responsibilities && experience.responsibilities.length > 0 && (
                      <List dense disablePadding sx={{ pl: 0 }}>
                        {experience.responsibilities.map((responsibility, idx) => (
                          <ListItem
                            key={idx}
                            disableGutters
                            sx={{ py: 0.5, alignItems: 'flex-start' }}
                          >
                            <ListItemIcon sx={{ minWidth: 22, mt: '9px' }}>
                              <FiberManualRecordIcon
                                sx={{ fontSize: 7, color: 'primary.main' }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={localize(responsibility, language)}
                              sx={{
                                m: 0,
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.9rem',
                                  color: 'text.secondary',
                                  lineHeight: 1.65,
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

ExperienceSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      company: PropTypes.string,
      title: PropTypes.string,
      period: PropTypes.string,
      duration: PropTypes.string,
      location: PropTypes.string,
      description: PropTypes.string,
      responsibilities: PropTypes.arrayOf(PropTypes.string),
      logo: PropTypes.string,
      active: PropTypes.bool,
      order: PropTypes.number,
    })
  ),
};

export default ExperienceSection;