import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import CapabilityIcon from '../ui/CapabilityIcon';

function CapabilitiesSection({ id, title, data, content }) {
  // Use data from props
  const capabilitiesData = data?.capabilities || [];
  const sectionTitle = title || 'What Can I Do?';
  const sectionContent = content || '';

  return (
    <section id={id} className="py-8">
      <SectionHeading sectionId={id}>{sectionTitle}</SectionHeading>

      {sectionContent && (
        <p className="mx-auto mb-12 max-w-[680px] text-center text-base leading-relaxed text-ink-muted md:text-lg">
          {sectionContent}
        </p>
      )}

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {capabilitiesData
          .filter(capability => capability.active !== false)
          .sort((a, b) => (a.order || 999) - (b.order || 999))
          .map((capability, index) => (
            <motion.article
              key={capability.id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
              className="glass motion-safe:hover:-translate-y-1.5 flex flex-col items-start gap-3 p-6 transition-[transform,box-shadow,border-color] duration-300 hover:border-brand/40"
            >
              {/* Icon in a tinted tile so it reads as a deliberate mark rather
                  than a stray image floating above the text. Falls back to a
                  keyword-matched inline icon when none has been uploaded. */}
              <div className="flex size-13 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10">
                {capability.icon ? (
                  <img
                    src={capability.icon.startsWith('http') ? capability.icon : `/${capability.icon}`}
                    alt=""
                    className="size-7 object-contain"
                  />
                ) : (
                  <CapabilityIcon title={capability.title} description={capability.description} />
                )}
              </div>

              <h3 className="text-[1.05rem] font-bold leading-snug text-ink">
                {capability.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {capability.description}
              </p>
            </motion.article>
          ))}
      </div>
    </section>
  );
}

export default CapabilitiesSection;
