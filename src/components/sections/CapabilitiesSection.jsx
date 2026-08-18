import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import CapabilityIcon from '../ui/CapabilityIcon';

function CapabilitiesSection({ id, title, data, content }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Use data from props
  const capabilitiesData = data?.capabilities || [];
  const sectionTitle = title || 'What Can I Do?';
  const sectionContent = content || '';

  return (
    <Box id={id} sx={{ py: 4 }}>
      {/* Page Title */}
      <SectionHeading sectionId={id}>{sectionTitle}</SectionHeading>

      {sectionContent && (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            mb: 6,
            maxWidth: '680px',
            mx: 'auto',
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.7,
          }}
        >
          {sectionContent}
        </Typography>
      )}

      {/* Grid of Cards */}
      <Box sx={{ maxWidth: isMobile? '100%' : '80%', margin: 'auto' }}>
        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {capabilitiesData
            .filter(capability => capability.active !== false)
            .sort((a, b) => (a.order || 999) - (b.order || 999))
            .map((capability, index) => (
            <Grid size={{ xs: 4, sm: 4, md: 4 }} key={capability.id || index}>
              <Card
                component={prefersReducedMotion ? 'div' : motion.div}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(18px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(180%)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.75)'}`,
                  boxShadow: isDark
                    ? '0 10px 28px rgba(0,0,0,0.32)'
                    : '0 10px 28px rgba(20,60,30,0.08)',
                  backgroundImage: 'none',
                  transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: isDark ? 'rgba(129,199,132,0.4)' : 'rgba(76,175,80,0.35)',
                    boxShadow: isDark
                      ? `0 18px 38px rgba(0,0,0,0.45), 0 0 20px ${theme.palette.primary.main}33`
                      : `0 18px 38px rgba(20,60,30,0.14), 0 0 20px ${theme.palette.primary.main}22`,
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                    '&:hover': { transform: 'none' },
                  },
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'start', gap: 1.5, p: 3 }}>
                  {/* Icon in a tinted tile so it reads as a deliberate mark
                      rather than a stray image floating above the text. Falls
                      back to a keyword-matched inline icon when no icon has
                      been uploaded for this item. */}
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isDark ? 'rgba(129,199,132,0.14)' : 'rgba(76,175,80,0.1)',
                      border: `1px solid ${isDark ? 'rgba(129,199,132,0.28)' : 'rgba(76,175,80,0.22)'}`,
                    }}
                  >
                    {capability.icon ? (
                      <Box
                        component="img"
                        src={capability.icon.startsWith('http') ? capability.icon : `/${capability.icon}`}
                        alt=""
                        sx={{ width: 28, height: 28, objectFit: 'contain' }}
                      />
                    ) : (
                      <CapabilityIcon title={capability.title} description={capability.description} />
                    )}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.05rem', lineHeight: 1.3 }}
                  >
                    {capability.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', lineHeight: 1.65 }}
                  >
                    {capability.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default CapabilitiesSection;
