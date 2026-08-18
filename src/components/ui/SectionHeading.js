import React from 'react';
import { useActiveSection } from '../../contexts/ActiveSectionContext';

// Section titles scale up and gain full color only while their section is the
// one being read. On a long single-page layout that gives one unmistakable
// "you are here" anchor without adding another element to scan.
function SectionHeading({ sectionId, children, className = '' }) {
  const { activeSection } = useActiveSection();
  const isActive = activeSection === sectionId;

  return (
    <h2
      className={[
        'mb-8 text-center font-extrabold leading-tight tracking-tight',
        'transition-[font-size,color,opacity] duration-400 motion-reduce:transition-none',
        isActive
          ? 'text-[2.4rem] text-brand opacity-100 md:text-[3.4rem]'
          : 'text-[1.9rem] text-ink-muted opacity-75 md:text-[2.4rem]',
        className,
      ].join(' ')}
    >
      {children}
    </h2>
  );
}

export default SectionHeading;
