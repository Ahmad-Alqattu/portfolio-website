import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HiOutlineDownload } from 'react-icons/hi';
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

// Cursor-driven 3D tilt for the photo card. Kept as its own component
// because framer-motion's mouse-tracking hooks can't sit behind the
// `image &&` conditional inside IntroSection's render.
function TiltPhoto({ children }) {
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="motion-reduce:![transform:none]"
    >
      {children}
    </motion.div>
  );
}

function IntroSection({ id, name, title, content, data }) {
  const { language, t } = useLanguage();
  const { subtitle, highlight, image, cvLink, available } = data || {};
  const showAvailable = available !== false;
  const localizedName = localize(name, language);
  const localizedSubtitle = localize(subtitle, language);
  const localizedHighlight = localize(highlight, language);
  const localizedContent = localize(content, language);

  return (
    <section id={id} className="relative mb-8 flex">
      {/* Ambient gradient mesh. Breaks out to the full viewport width so its
          edges never show as a rectangle against the page background — the
          content column is narrower than the glow needs to be. */}
      <div
        aria-hidden
        className="hero-mesh pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative m-auto w-full max-w-[1100px] px-4 pt-24 pb-8 md:pt-28 md:pb-12"
      >
        <div className="grid grid-cols-1 items-start gap-x-12 gap-y-6 md:grid-cols-12">
          {/* Name, role pill, tagline */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center gap-4 py-4 md:col-span-7 md:col-start-1 md:row-start-1"
          >
            {name && (
              <h1 className="text-shimmer text-[2.5rem] font-extrabold leading-[1.05] tracking-[-1.5px] md:text-[3.75rem]">
                {localizedName}
              </h1>
            )}
            {localizedSubtitle && (
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5">
                <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                <span className="text-[0.8rem] font-bold text-brand">{localizedSubtitle}</span>
              </span>
            )}
            {localizedHighlight && (
              <p className="max-w-[22ch] text-[1.3rem] font-semibold leading-snug text-ink-muted md:text-[1.6rem]">
                {localizedHighlight}
              </p>
            )}
          </motion.div>

          {/* Photo */}
          {image && (
            <motion.div
              variants={itemVariants}
              className="relative min-h-[300px] md:col-span-5 md:col-start-8 md:row-span-3 md:row-start-1 md:min-h-0"
            >
              <div
                aria-hidden
                className="photo-glow-spin absolute -inset-3.5 -z-10 rounded-[32px] opacity-30 blur-[44px]"
              >
                <div className="photo-glow-spin-inner" />
              </div>
              <TiltPhoto>
                <div className="relative min-h-[300px] overflow-hidden rounded-3xl shadow-[0_20px_44px_rgba(20,60,30,0.14)] md:min-h-[400px] dark:shadow-[0_20px_44px_rgba(0,0,0,0.45)]">
                  <img
                    src={image}
                    alt={localizedName || 'Profile picture'}
                    className="size-full min-h-[300px] object-cover object-[center_22%] md:min-h-[400px]"
                  />
                  {showAvailable && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 backdrop-blur-sm dark:bg-black/75">
                      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                      <span className="text-[0.7rem] font-bold text-brand">{t('intro.available')}</span>
                    </span>
                  )}
                </div>
              </TiltPhoto>
            </motion.div>
          )}

          {/* Bio — plain prose. A card around a single paragraph adds a border,
              a shadow and a background without adding any meaning. */}
          {localizedContent && (
            <motion.p
              variants={itemVariants}
              className="max-w-[60ch] leading-[1.75] text-ink-muted md:col-span-7 md:col-start-1 md:row-start-2 md:text-lg"
            >
              {localizedContent}
            </motion.p>
          )}

          {/* Resume download — a small action, so a button, not a panel */}
          {cvLink && (
            <motion.div
              variants={itemVariants}
              className="flex items-start md:col-span-7 md:col-start-1 md:row-start-3"
            >
              <span className="relative inline-flex">
                {/* Glow behind the glass so the blur has something to refract
                    against on a flat page background */}
                <motion.span
                  aria-hidden
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-2.5 -z-10 rounded-full bg-linear-to-br from-brand-light to-brand-dark opacity-45 blur-2xl motion-reduce:animate-none"
                />
                <a
                  href={cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group motion-safe:hover:-translate-y-[3px] inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[0.95rem] font-bold text-ink transition-[transform,box-shadow,background-color] duration-300 hover:shadow-[0_14px_30px_rgba(20,60,30,0.18)]"
                >
                  <HiOutlineDownload
                    aria-hidden
                    className="size-5 transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                  {t('intro.downloadResume')}
                </a>
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default IntroSection;
