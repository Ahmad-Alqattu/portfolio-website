// Shared glass surfaces, so every section speaks the same visual language and
// a change to the treatment happens in one place.

export const glassCardSx = (theme) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    borderRadius: '20px',
    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(18px) saturate(180%)',
    WebkitBackdropFilter: 'blur(18px) saturate(180%)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.75)'}`,
    boxShadow: isDark
      ? '0 10px 28px rgba(0,0,0,0.32)'
      : '0 10px 28px rgba(20,60,30,0.08)',
    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: isDark ? 'rgba(129,199,132,0.4)' : 'rgba(76,175,80,0.35)',
      boxShadow: isDark
        ? `0 18px 38px rgba(0,0,0,0.45), 0 0 20px ${theme.palette.primary.main}33`
        : `0 18px 38px rgba(20,60,30,0.14), 0 0 20px ${theme.palette.primary.main}22`,
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': { transform: 'none' },
    },
  };
};

export const glassChipSx = (theme) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    fontWeight: 500,
    color: 'text.primary',
    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.85)'}`,
    transition: 'border-color 0.25s ease, background-color 0.25s ease',
    '&:hover': {
      borderColor: isDark ? 'rgba(129,199,132,0.45)' : 'rgba(76,175,80,0.4)',
    },
  };
};
