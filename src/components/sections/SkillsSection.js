import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import SectionHeading from '../ui/SectionHeading';
import SkillIcon from '../ui/SkillIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

function SkillsSection({ id, title, content }) {
  const { sections } = useData();
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
    <section id={id} className="py-8">
      <SectionHeading sectionId={id}>{localize(title, language) || 'Skills'}</SectionHeading>

      {content && (
        <p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed text-ink-muted md:text-lg">
          {localize(content, language)}
        </p>
      )}

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-4 text-center text-[0.85rem] font-bold uppercase tracking-[1.5px] text-brand">
              {category}
            </h3>
            <ul className="flex flex-wrap justify-center gap-2">
              {skillsList[category].map((skill, idx) => {
                // A skill may be a plain string or a { en, ar } object; the
                // icon always matches on the English name so the logo stays
                // right regardless of the display language.
                const label = localize(skill, language);
                return (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
                    className="glass motion-safe:hover:-translate-y-[3px] flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-ink transition-[transform,box-shadow,border-color] duration-250 hover:border-brand/40 hover:shadow-[0_8px_20px_rgba(20,60,30,0.12)]"
                  >
                    <SkillIcon name={localize(skill, 'en')} />
                    {label}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
