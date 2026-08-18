import React, { useState, useEffect, useRef } from 'react';
import LazyLoad from 'react-lazyload';
import { FiGithub, FiArrowUpRight, FiX, FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import PropTypes from 'prop-types';
import SectionHeading from '../ui/SectionHeading';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';
import localizedText from '../../utils/localizedText';

function useProjectsState() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  return { visibleCount, setVisibleCount, selectedProject, setSelectedProject, showAll, setShowAll };
}

const arrowClass =
  'absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors duration-200 hover:bg-black/70';

function CarouselDots({ count, current, onSelect }) {
  return (
    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to item ${index + 1}`}
          onClick={() => onSelect(index)}
          className={`size-2 rounded-full transition-colors duration-200 ${
            index === current ? 'bg-white' : 'bg-white/50'
          }`}
        />
      ))}
    </div>
  );
}

// Videos first, then images, all in one strip — a project's media is one
// story, not two separate galleries.
function ProjectMediaCarousel({ videos, images }) {
  const media = [
    ...(videos || []).map((src) => ({ type: 'video', src })),
    ...(images || []).map((src) => ({ type: 'image', src })),
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (media.length === 0) {
    return null;
  }

  const resolve = (src) => (src.startsWith('http') ? src : `/${src}`);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  const current = media[currentIndex];

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5">
      <div className="flex max-h-[45vh] items-center justify-center sm:max-h-[55vh]">
        {current.type === 'video' ? (
          <video
            key={current.src}
            src={resolve(current.src)}
            controls
            className="max-h-[45vh] max-w-full object-contain sm:max-h-[55vh]"
            onError={(e) => {
              console.error('Video failed to load:', e.target.src);
            }}
          />
        ) : (
          <picture>
            <source srcSet={resolve(current.src)} type="image/webp" />
            <img
              src={resolve(current.src)}
              alt={`Project media ${currentIndex + 1}`}
              className="max-h-[45vh] max-w-full object-contain sm:max-h-[55vh]"
              onError={(e) => {
                // Fallback for GitHub images
                if (e.target.src.includes('github.com')) {
                  e.target.src = e.target.src.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                }
              }}
            />
          </picture>
        )}
      </div>

      {media.length > 1 && (
        <>
          <button type="button" onClick={handlePrev} aria-label="Previous" className={`${arrowClass} left-2`}>
            <FiChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={handleNext} aria-label="Next" className={`${arrowClass} right-2`}>
            <FiChevronRight aria-hidden className="size-5" />
          </button>
          <CarouselDots count={media.length} current={currentIndex} onSelect={setCurrentIndex} />
        </>
      )}
    </div>
  );
}

ProjectMediaCarousel.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.string),
  images: PropTypes.arrayOf(PropTypes.string),
};

function ProjectsSection({ id, title, content, projects }) {
  const { visibleCount, setVisibleCount, selectedProject, setSelectedProject, showAll, setShowAll } = useProjectsState();
  const { language, t } = useLanguage();
  const localizedTitle = localize(title, language);
  const localizedContent = localize(content, language);
  const dialogRef = useRef(null);

  // Native <dialog> gives focus trapping, Escape-to-close and inert background
  // for free — behaviour a hand-rolled modal has to reimplement.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedProject && !dialog.open) {
      dialog.showModal();
    } else if (!selectedProject && dialog.open) {
      dialog.close();
    }
  }, [selectedProject]);

  // Helper function to get primary link from project
  const getPrimaryLink = (project) => {
    if (!project.link) return null;
    if (Array.isArray(project.link)) {
      return project.link[0] || project.link[1] || null; // Return first non-empty link
    }
    return project.link;
  };

  // Helper function to get link type for icon
  const getLinkType = (link) => {
    if (!link) return 'view';
    return link.includes('github.com') ? 'github' : 'view';
  };

  if (!Array.isArray(projects)) {
    return (
      <section id={id} className="py-16">
        <SectionHeading sectionId={id} className="mb-6">{localizedTitle}</SectionHeading>
        <p className="text-center text-lg text-ink-muted">{localizedContent}</p>
        <p className="mt-2 text-center text-red-600 dark:text-red-400">{t('projects.noProjects')}</p>
      </section>
    );
  }

  // Filter only active projects and sort by order if available
  const activeProjects = projects
    .filter(project => project.active !== false) // Show projects that are not explicitly inactive
    .sort((a, b) => (a.order || 999) - (b.order || 999)); // Sort by order, fallback to end if no order

  const handleLoadMore = () => {
    setShowAll(true);
    setVisibleCount(activeProjects.length);
  };

  const handleShowLess = () => {
    setShowAll(false);
    setVisibleCount(6);
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const visibleProjects = activeProjects.slice(0, visibleCount);

  return (
    <section id={id} className="py-16">
      <SectionHeading sectionId={id} className="mb-6">{localizedTitle}</SectionHeading>

      <p className="mx-auto mb-10 max-w-3xl text-center text-lg leading-relaxed text-ink-muted md:text-xl">
        {localizedContent}
      </p>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7 lg:grid-cols-3">
        {visibleProjects.map((project) => {
          const primaryLink = getPrimaryLink(project);
          const linkType = getLinkType(primaryLink);
          const hasImage = project.images && project.images.length > 0;
          const hasVideo = project.videos && project.videos.length > 0;

          return (
            <LazyLoad key={project.id} height={340} offset={100} once>
              <div
                className="group relative isolate aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[28px] bg-neutral-900 shadow-lg ring-1 ring-black/10 transition-all duration-300 ease-out motion-safe:hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/20 hover:ring-brand/60 sm:aspect-[4/4.5]"
                onClick={() => handleOpenModal(project)}
              >
                {/* Media background */}
                {hasImage ? (
                  <picture>
                    <source
                      srcSet={project.images[0].startsWith('http') ? project.images[0] : `/${project.images[0]}`}
                      type="image/webp"
                    />
                    <img
                      src={project.images[0].startsWith('http') ? project.images[0] : `/${project.images[0]}`}
                      alt={`${localize(project.name, language)} thumbnail`}
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        // Fallback for GitHub images
                        if (e.target.src.includes('github.com')) {
                          e.target.src = e.target.src.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                        }
                      }}
                    />
                  </picture>
                ) : hasVideo ? (
                  <video
                    src={project.videos[0].startsWith('http') ? project.videos[0] : `/${project.videos[0]}`}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-110"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-brand via-brand-dark to-neutral-900 transition-transform duration-700 ease-out motion-safe:group-hover:scale-110" />
                )}

                {/* Legibility gradient, always on */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/95 via-black/35 to-black/0" />
                {/* Extra darken on hover so the CTA row pops */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />

                {/* Top badges */}
                <div className="absolute right-3 top-3 flex gap-2">
                  {hasImage && project.images.length > 1 && (
                    <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {t('projects.moreCount', { count: project.images.length - 1 })}
                    </span>
                  )}
                  {hasVideo && (
                    <span className="flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md">
                      <FiPlay aria-hidden className="size-3.5" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-lg font-bold leading-snug text-white drop-shadow-sm">
                    {localize(project.name, language)}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-white/75">
                    {localize(project.fullDescription, language) || localize(project.description, language)}
                  </p>

                  <div className="mt-4 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100">
                    <button
                      type="button"
                      className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-neutral-900 transition-colors duration-200 hover:bg-brand-light"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(project);
                      }}
                    >
                      {t('projects.moreInfo')}
                    </button>
                    {primaryLink && (
                      <a
                        href={primaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full border border-white/50 px-4 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-white/15"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('projects.view')}
                        {linkType === 'github' ? (
                          <FiGithub aria-hidden className="size-3.5" />
                        ) : (
                          <FiArrowUpRight aria-hidden className="size-3.5" />
                        )}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </LazyLoad>
          );
        })}
      </div>

      {/* See More / See Less Button */}
      <div className="mt-10 text-center">
        {!showAll && visibleCount < activeProjects.length && (
          <button
            type="button"
            onClick={handleLoadMore}
            className="rounded-full bg-linear-to-r from-brand to-brand-dark px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-300 motion-safe:hover:scale-105 hover:shadow-brand/40"
          >
            {t('projects.seeMore')} ({activeProjects.length - visibleCount} {t('projects.more')})
          </button>
        )}

        {showAll && activeProjects.length > 6 && (
          <button
            type="button"
            onClick={handleShowLess}
            className="ml-3 rounded-full border border-ink/15 px-6 py-2.5 text-sm font-semibold text-ink transition-all duration-300 motion-safe:hover:scale-105 hover:bg-ink/5"
          >
            {t('projects.seeLess')}
          </button>
        )}
      </div>

      {/* Full project details */}
      <dialog
        ref={dialogRef}
        onClose={handleCloseModal}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself, outside its box)
          if (e.target === dialogRef.current) handleCloseModal();
        }}
        className="w-[min(100%-2rem,48rem)] overflow-hidden rounded-[28px] border border-white/15 bg-surface-raised/60 p-0 text-ink shadow-2xl backdrop-blur-[32px] backdrop-saturate-150 backdrop:bg-black/60 backdrop:backdrop-blur-[10px]"
      >
        {selectedProject && (
          <>
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
              <h2 className="text-2xl font-bold leading-tight text-ink">
                {localize(selectedProject.name, language)}
              </h2>
              <div className="flex shrink-0 gap-2">
                {getPrimaryLink(selectedProject) && (
                  <a
                    href={getPrimaryLink(selectedProject)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-brand-dark"
                  >
                    {t('projects.view')}
                    {getLinkType(getPrimaryLink(selectedProject)) === 'github' ? (
                      <FiGithub aria-hidden className="size-3.5" />
                    ) : (
                      <FiArrowUpRight aria-hidden className="size-3.5" />
                    )}
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  aria-label={t('projects.close')}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink transition-colors duration-200 hover:bg-ink/20"
                >
                  <FiX aria-hidden className="size-4.5" />
                </button>
              </div>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-5 pb-6 sm:px-8 sm:pb-8">
              <ProjectMediaCarousel videos={selectedProject.videos} images={selectedProject.images} />

              <p className="whitespace-pre-line text-[1.0625rem] leading-relaxed text-ink-muted">
                {localize(selectedProject.fullDescription, language) || localize(selectedProject.description, language)}
              </p>
            </div>

            <div className="px-6 pb-6 text-end sm:px-8 sm:pb-8">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink transition-all duration-200 motion-safe:hover:scale-105 hover:bg-ink/5"
              >
                {t('projects.close')}
              </button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}

ProjectsSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: localizedText.isRequired,
  content: localizedText.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: localizedText.isRequired,
      description: localizedText,
      fullDescription: localizedText,
      images: PropTypes.arrayOf(PropTypes.string),
      videos: PropTypes.arrayOf(PropTypes.string),
      link: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]),
      active: PropTypes.bool,
      order: PropTypes.number,
    })
  ).isRequired,
};

export default ProjectsSection;
