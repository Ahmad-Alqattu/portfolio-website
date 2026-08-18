import React from 'react';
import { Typography, Box, Avatar, useMediaQuery, useTheme, Button } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { Download } from '@mui/icons-material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const shimmer = keyframes`
  to { background-position: 200% center; }
`;

// Cursor-driven 3D tilt for the photo card. Kept as its own component
// because framer-motion's mouse-tracking hooks can't sit behind the
// `image &&` conditional inside IntroSection's render.
function TiltPhoto({ disabled, children }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springConfig = { stiffness: 200, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), springConfig);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      onMouseMove={disabled ? undefined : handleMouseMove}
      onMouseLeave={disabled ? undefined : handleMouseLeave}
      style={{
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        transformPerspective: 900,
      }}
    >
      {children}
    </motion.div>
  );
}

function IntroSection({ id, name, title, content, data }) {
  const { language, t } = useLanguage();
  const { subtitle, highlight, image, cvLink } = data || {};
  const localizedName = localize(name, language);
  const localizedSubtitle = localize(subtitle, language);
  const localizedHighlight = localize(highlight, language);
  const localizedContent = localize(content, language);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <section
      id={id}
      style={{
        position: 'relative',
        display: 'flex',
        marginBottom: '2rem',
      }}
    >
      {/* Ambient gradient mesh. Breaks out to the full viewport width so its
          edges never show as a rectangle against the page background — the
          content column is narrower than the glow needs to be. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '100vw',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          background: isDark
            ? `radial-gradient(ellipse 640px 640px at 78% 12%, ${theme.palette.primary.dark}33, transparent 65%),
               radial-gradient(ellipse 480px 480px at 8% 88%, ${theme.palette.primary.dark}22, transparent 65%)`
            : `radial-gradient(ellipse 640px 640px at 78% 12%, ${theme.palette.primary.light}40, transparent 65%),
               radial-gradient(ellipse 480px 480px at 8% 88%, #ff572515, transparent 65%)`,
        }}
      />

      <Box
        component={motion.div}
        variants={prefersReducedMotion ? undefined : containerVariants}
        initial={prefersReducedMotion ? undefined : 'hidden'}
        animate={prefersReducedMotion ? undefined : 'visible'}
        sx={{
          position: 'relative',
          margin: 'auto',
          width: '100%',
          maxWidth: isMobile ? '100%' : '1100px',
          px: 2,
          // Clear the fixed header capsule — without this the name collides
          // with it on shorter viewports
          pt: { xs: 12, md: 14 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
            gridTemplateAreas: {
              xs: '"kicker" "photo" "bio" "cta"',
              md: '"kicker kicker kicker kicker kicker kicker kicker photo photo photo photo photo" "bio bio bio bio bio bio bio photo photo photo photo photo" "cta cta cta cta cta cta cta photo photo photo photo photo"',
            },
            columnGap: 6,
            rowGap: 3,
            alignItems: 'start',
          }}
        >
          {/* Headline card: name kicker + role pill + big tagline */}
          <Box component={motion.div} variants={itemVariants} sx={{ gridArea: 'kicker', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, py: 2 }}>
            {name && (
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  lineHeight: 1.05,
                  letterSpacing: '-1.5px',
                  fontWeight: 800,
                  ...(prefersReducedMotion
                    ? { color: 'text.primary' }
                    : {
                        backgroundImage: `linear-gradient(90deg, ${theme.palette.text.primary} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.text.primary} 75%)`,
                        backgroundSize: '200% auto',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        WebkitTextFillColor: 'transparent',
                        animation: `${shimmer} 5s linear infinite`,
                      }),
                }}
              >
                {localizedName}
              </Typography>
            )}
            {localizedSubtitle && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.7,
                  borderRadius: '999px',
                  bgcolor: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)',
                  border: `1px solid ${isDark ? 'rgba(129,199,132,0.35)' : 'rgba(76,175,80,0.3)'}`,
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'primary.main' }}>
                  {localizedSubtitle}
                </Typography>
              </Box>
            )}
            {localizedHighlight && (
              <Typography
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  fontSize: { xs: '1.3rem', md: '1.6rem' },
                  color: 'text.secondary',
                  maxWidth: '22ch',
                }}
              >
                {localizedHighlight}
              </Typography>
            )}
          </Box>

          {/* Photo card */}
          {image && (
            <Box component={motion.div} variants={itemVariants} sx={{ gridArea: 'photo', position: 'relative', minHeight: { xs: 300, md: 'auto' } }}>
              <Box
                sx={{
                  position: 'absolute',
                  inset: '-14px',
                  borderRadius: '32px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                  filter: 'blur(44px)',
                  opacity: isDark ? 0.28 : 0.3,
                  zIndex: -1,
                }}
              />
              <TiltPhoto disabled={isMobile || prefersReducedMotion}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minHeight: { xs: 300, md: 400 },
                    overflow: 'hidden',
                    borderRadius: '24px',
                    boxShadow: isDark
                      ? '0 20px 44px rgba(0,0,0,0.45)'
                      : '0 20px 44px rgba(20,60,30,0.14)',
                  }}
                >
                  <Avatar
                    src={image}
                    alt={localizedName || 'Profile picture'}
                    variant="rounded"
                    imgProps={{ style: { objectPosition: 'center 22%' } }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight: { xs: 300, md: 400 },
                      borderRadius: 0,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '999px',
                      bgcolor: isDark ? 'rgba(20,20,20,0.75)' : 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'primary.main' }}>
                      {t('intro.available')}
                    </Typography>
                  </Box>
                </Box>
              </TiltPhoto>
            </Box>
          )}

          {/* Bio — plain prose. A card around a single paragraph adds a border,
              a shadow and a background without adding any meaning. */}
          {localizedContent && (
            <Box component={motion.div} variants={itemVariants} sx={{ gridArea: 'bio' }}>
              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.75,
                  color: 'text.secondary',
                  maxWidth: '60ch',
                }}
              >
                {localizedContent}
              </Typography>
            </Box>
          )}

          {/* Resume download — a small action, so a normal button, not a panel */}
          {cvLink && (
            <Box component={motion.div} variants={itemVariants} sx={{ gridArea: 'cta', display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                {/* Glow behind the glass so the blur has something to refract
                    against on a flat page background */}
                <Box
                  aria-hidden
                  component={prefersReducedMotion ? 'div' : motion.div}
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.08, 1] }}
                  transition={prefersReducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute',
                    inset: '-10px',
                    borderRadius: '999px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                    filter: 'blur(16px)',
                    opacity: isDark ? 0.4 : 0.45,
                    zIndex: -1,
                  }}
                />
                <Button
                  component="a"
                  href={cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  disableElevation
                  startIcon={<Download />}
                  sx={{
                    px: 3.5,
                    py: 1.4,
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    color: isDark ? '#fff' : 'text.primary',
                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.35)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.8)'}`,
                    boxShadow: isDark
                      ? '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                      : '0 8px 24px rgba(20,60,30,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, background-color 0.3s ease',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)',
                      transform: 'translateY(-3px)',
                      boxShadow: isDark
                        ? `0 14px 30px rgba(0,0,0,0.5), 0 0 20px ${theme.palette.primary.main}55`
                        : `0 14px 30px rgba(20,60,30,0.18), 0 0 20px ${theme.palette.primary.main}44`,
                    },
                    '&:active': { transform: 'translateY(-1px)' },
                    '& .MuiButton-startIcon': {
                      transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                    },
                    '&:hover .MuiButton-startIcon': {
                      transform: 'translateY(3px)',
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                      '&:hover': { transform: 'none' },
                    },
                  }}
                >
                  {t('intro.downloadResume')}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </section>
  );
}

export default IntroSection;
