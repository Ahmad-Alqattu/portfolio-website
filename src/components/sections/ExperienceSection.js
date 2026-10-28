import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import SectionHeading from '../ui/SectionHeading';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';
import localizedText from '../../utils/localizedText';
import { imageProps } from '../../utils/images';

const ExperienceSection = ({ id, title, experiences = [] }) => {
  const { language } = useLanguage();

  return (
    <section id={id} className="mx-auto max-w-[860px] py-12">
      <SectionHeading sectionId={id}>{localize(title, language)}</SectionHeading>

      <div className="flex flex-col gap-6">
        {experiences
          .filter(experience => experience.active !== false)
          .sort((a, b) => (a.order || 999) - (b.order || 999))
          .map((experience, index) => (
            <motion.article
              key={experience.id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
              className="glass motion-safe:hover:-translate-y-1 p-6 transition-[transform,box-shadow,border-color] duration-300 hover:border-brand/40 md:p-8"
            >
              {/* Company Header */}
              <div className="mb-4 flex items-start gap-5">
                {experience.logo && (
                  <img
                    {...imageProps(experience.logo, '56px')}
                    loading="lazy"
                    decoding="async"
                    alt={`${localize(experience.company, language)} logo`}
                    className="size-14 shrink-0 rounded-xl object-contain"
                  />
                )}
                <div className="min-w-0 grow">
                  <h3 className="text-lg font-bold leading-snug text-ink md:text-[1.35rem]">
                    {localize(experience.company, language)}
                  </h3>
                  <p className="mt-0.5 text-[0.95rem] font-semibold text-brand">
                    {localize(experience.title, language)}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {localize(experience.period, language) || localize(experience.duration, language)}
                    {experience.location && ` • ${localize(experience.location, language)}`}
                  </p>
                </div>
              </div>

              {/* Body text lines up with the company name rather than the card
                  edge, so each entry reads as one text column */}
              <div className={experience.logo ? 'md:ml-[76px]' : ''}>
                {experience.description && (
                  <p className="mb-3 leading-relaxed text-ink-muted">
                    {localize(experience.description, language)}
                  </p>
                )}

                {experience.responsibilities && experience.responsibilities.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {experience.responsibilities.map((responsibility, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-[9px] size-[7px] shrink-0 rounded-full bg-brand"
                        />
                        <span className="text-sm leading-relaxed text-ink-muted">
                          {localize(responsibility, language)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.article>
          ))}
      </div>
    </section>
  );
};

ExperienceSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: localizedText.isRequired,
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      company: localizedText,
      title: localizedText,
      period: localizedText,
      duration: localizedText,
      location: localizedText,
      description: localizedText,
      responsibilities: PropTypes.arrayOf(localizedText),
      logo: PropTypes.string,
      active: PropTypes.bool,
      order: PropTypes.number,
    })
  ),
};

export default ExperienceSection;
