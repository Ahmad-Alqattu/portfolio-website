import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineDownload, HiOutlineEye, HiOutlineBadgeCheck } from 'react-icons/hi';
import PropTypes from 'prop-types';
import SectionHeading from '../ui/SectionHeading';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';
import localizedText from '../../utils/localizedText';

const CertificatesSection = ({ id, title, content, data }) => {
  const { language, t } = useLanguage();
  const certificates = data?.certificates || [];

  // Filter active certificates and sort by order
  const activeCertificates = certificates
    .filter(cert => cert.active !== false)
    .sort((a, b) => (a.order || 999) - (b.order || 999));

  if (activeCertificates.length === 0) {
    return null; // Don't render if no certificates
  }

  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading sectionId={id} className="mb-4">{localize(title, language)}</SectionHeading>

      {content && (
        <p className="mx-auto mb-10 max-w-[600px] text-center text-lg leading-relaxed text-ink-muted">
          {localize(content, language)}
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {activeCertificates.map((certificate, index) => {
          const viewLink = certificate.link || certificate.pdf;
          const downloadLink =
            certificate.pdf && certificate.pdf !== certificate.link ? certificate.pdf : null;

          return (
            <motion.article
              key={certificate.id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
              className="glass group motion-safe:hover:-translate-y-1.5 flex flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-300 hover:border-brand/40"
            >
              {certificate.image && (
                // A certificate is a document: show the whole page on a neutral
                // mat rather than cropping it to a banner, which cuts the
                // content out and makes every card crop differently.
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/[0.04] p-4 dark:bg-white/[0.04]">
                  <img
                    src={certificate.image.startsWith('http') ? certificate.image : `/${certificate.image}`}
                    alt={`${localize(certificate.name, language)} certificate`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain shadow-sm transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
                  />

                  {certificate.link && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                      <HiOutlineBadgeCheck aria-hidden className="size-3.5" />
                      {t('certificates.verified')}
                    </span>
                  )}
                </div>
              )}

              {/* Caption strip: metadata on the left, actions on the right, so
                  the buttons sit in a deliberate place instead of floating in
                  the middle of empty space. */}
              <div className="flex grow items-end justify-between gap-4 p-5">
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
                    {localize(certificate.name, language)}
                  </h3>
                  <p className="mt-1 truncate text-sm text-ink-muted">
                    {[localize(certificate.issuer, language), certificate.issueDate]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  {certificate.description && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {localize(certificate.description, language)}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  {viewLink && (
                    <a
                      href={viewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${localize(certificate.name, language)}`}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-brand/15 text-brand transition-[background-color,transform] duration-200 hover:bg-brand/25 motion-safe:hover:scale-105"
                    >
                      <HiOutlineEye aria-hidden className="size-5" />
                    </a>
                  )}
                  {downloadLink && (
                    <a
                      href={downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${localize(certificate.name, language)}`}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-brand/30 text-brand transition-[background-color,transform] duration-200 hover:bg-brand/10 motion-safe:hover:scale-105 [&>svg]:transition-transform [&>svg]:duration-200 motion-safe:hover:[&>svg]:translate-y-0.5"
                    >
                      <HiOutlineDownload aria-hidden className="size-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

CertificatesSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: localizedText.isRequired,
  content: localizedText,
  data: PropTypes.shape({
    certificates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: localizedText,
        issuer: localizedText,
        issueDate: PropTypes.string,
        description: localizedText,
        image: PropTypes.string,
        link: PropTypes.string,
        pdf: PropTypes.string,
        active: PropTypes.bool,
        order: PropTypes.number,
      })
    ),
  }),
};

export default CertificatesSection;
