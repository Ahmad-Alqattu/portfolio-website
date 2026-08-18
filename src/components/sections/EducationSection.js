// src/components/sections/EducationSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import SectionHeading from '../ui/SectionHeading';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';
import localizedText from '../../utils/localizedText';

function EducationSection({ id, title, content, educationList = [] }) {
  // Use educationList as the primary data source
  const validEducationList = Array.isArray(educationList) ? educationList : [];
  const { language, t } = useLanguage();

  return (
    <section id={id} className="py-16">
      <SectionHeading sectionId={id}>{localize(title, language)}</SectionHeading>

      {content && (
        <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-ink-muted md:text-xl">
          {localize(content, language)}
        </p>
      )}

      <div className="mx-auto flex max-w-[860px] flex-col gap-6">
        {validEducationList
          .filter(education => education.active !== false) // Show only active education items
          .sort((a, b) => (a.order || 999) - (b.order || 999)) // Sort by order
          .map((education, index) => (
            <motion.article
              key={education.id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
              className="glass motion-safe:hover:-translate-y-1 p-6 transition-[transform,box-shadow,border-color] duration-300 hover:border-brand/40 md:p-8"
            >
              <div className="flex items-start gap-5">
                {education.logo && (
                  <img
                    src={education.logo}
                    alt={`${localize(education.institution, language)} logo`}
                    className="size-14 shrink-0 rounded-xl object-contain"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug text-ink md:text-[1.35rem]">
                    {localize(education.institution, language)}
                  </h3>
                  <p className="mt-0.5 text-[0.95rem] font-semibold text-brand">
                    {localize(education.degree, language)}
                    {education.major && ` in ${localize(education.major, language)}`}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {localize(education.duration, language) || localize(education.years, language)}
                    {education.location && ` • ${localize(education.location, language)}`}
                  </p>
                </div>
              </div>

              {/* Body text lines up with the institution name rather than the
                  card edge, so each entry reads as one text column */}
              <div className={education.logo ? 'md:ml-[76px]' : ''}>
                {(education.description || education.details) && (
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {localize(education.description, language) || localize(education.details, language)}
                  </p>
                )}

                {education.electives && Array.isArray(education.electives) && education.electives.length > 0 && (
                  <div className="mt-5">
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-[1.2px] text-brand">
                      {t('education.electiveSubjects')}
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {education.electives.map((subject, idx) => (
                        <li
                          key={idx}
                          className="glass rounded-full px-3 py-1 text-xs font-medium text-ink transition-colors duration-250 hover:border-brand/40"
                        >
                          {localize(subject, language)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
      </div>
    </section>
  );
}

EducationSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: localizedText.isRequired,
  content: localizedText, // Made optional
  educationList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      institution: localizedText,
      degree: localizedText,
      major: localizedText, // Firebase data uses major field
      duration: localizedText, // New editor field
      years: localizedText, // Firebase data uses years field
      description: localizedText, // New editor field
      details: localizedText, // Firebase data uses details field
      location: localizedText,
      logo: PropTypes.string,
      level: PropTypes.string, // university/school distinction
      electives: PropTypes.arrayOf(localizedText), // Firebase data has electives array
    })
  ),
};

export default EducationSection;
