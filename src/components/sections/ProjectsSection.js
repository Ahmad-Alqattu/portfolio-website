import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PropTypes from 'prop-types';
import SectionHeading from '../ui/SectionHeading';
import { useLanguage } from '../../contexts/LanguageContext';
import { localize } from '../../utils/localize';

function useProjectsState() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  return { visibleCount, setVisibleCount, selectedProject, setSelectedProject, showAll, setShowAll };
}

// Separate Image and Video carousels
function ImageCarousel({ images, isMobile }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ maxHeight: isMobile ? '50vh' : '70vh' }}>
      <div className="flex items-center justify-center" style={{ maxHeight: isMobile ? '50vh' : '70vh' }}>
        <picture>
          <source 
            srcSet={images[currentIndex].startsWith('http') ? images[currentIndex] : `/${images[currentIndex]}`} 
            type="image/webp" 
          />
          <img
            src={images[currentIndex].startsWith('http') ? images[currentIndex] : `/${images[currentIndex]}`}
            alt={`Project image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: isMobile ? '50vh' : '70vh' }}
            onError={(e) => {
              // Fallback for GitHub images
              if (e.target.src.includes('github.com')) {
                e.target.src = e.target.src.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
              }
            }}
          />
        </picture>
      </div>
      
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function VideoCarousel({ videos, isMobile }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!videos || videos.length === 0) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ maxHeight: isMobile ? '50vh' : '70vh' }}>
      <div className="flex items-center justify-center" style={{ maxHeight: isMobile ? '50vh' : '70vh' }}>
        <video
          src={videos[currentIndex].startsWith('http') ? videos[currentIndex] : `/${videos[currentIndex]}`}
          controls
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: isMobile ? '50vh' : '70vh' }}
          onError={(e) => {
            console.error('Video failed to load:', e.target.src);
          }}
        />
      </div>
      
      {videos.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

VideoCarousel.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.string),
};

function MediaCarousel({ media }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        textAlign: 'center',
        mb: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <picture>
        {media[currentIndex].endsWith('.mp4') || media[currentIndex].endsWith('.webm') ? (
          <video
            src={media[currentIndex]}
            controls
            style={{ maxHeight: '65vh', maxWidth: '100%', height: 'auto', borderRadius: '8px', margin: '0 auto' }}
          />
        ) : media[currentIndex].startsWith('http') ? (
          <img
            src={media[currentIndex]}
            alt={`Project ${currentIndex + 1}`}
            style={{ maxHeight: '65vh', maxWidth: '100%', height: 'auto', borderRadius: '8px', margin: '0 auto' }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <source
              srcSet={`${media[currentIndex].replace(/\\/g, '/').replace(/\.(png|jpg|jpeg)$/, '.webp')}`}
              type="image/webp"
            />
            <img
              src={media[currentIndex].replace(/\\/g, '/')}
              alt={`Project ${currentIndex + 1}`}
              style={{ maxHeight: '65vh', maxWidth: '100%', height: 'auto', borderRadius: '8px', margin: '0 auto' }}
              loading="lazy"
              decoding="async"
            />
          </>
        )}
      </picture>
      {media.length > 1 && (
        <>
          <Button
            onClick={handlePrev}
            variant="contained"
            size="small"
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: '40px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            ‹
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            size="small"
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: '40px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            ›
          </Button>
        </>
      )}
    </Box>
  );
}

MediaCarousel.propTypes = {
  media: PropTypes.arrayOf(PropTypes.string),
};

function ProjectsSection({ id, title, content, projects }) {
  const { visibleCount, setVisibleCount, selectedProject, setSelectedProject, showAll, setShowAll } = useProjectsState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { language, t } = useLanguage();
  const localizedTitle = localize(title, language);
  const localizedContent = localize(content, language);

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
        <Typography variant="h1" component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
          {localizedTitle}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.25rem', color: 'text.secondary' }}>
          {localizedContent}
        </Typography>
        <Typography color="error">{t('projects.noProjects')}</Typography>
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
      <SectionHeading sectionId={id} sx={{ mb: 3 }}>{localizedTitle}</SectionHeading>

      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1.125rem', md: '1.25rem' },
          color: 'text.secondary',
          mb: 4,
          maxWidth: '80%',
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        {localizedContent}
      </Typography>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7 lg:grid-cols-3">
        {visibleProjects.map((project) => {
          const primaryLink = getPrimaryLink(project);
          const linkType = getLinkType(primaryLink);
          const hasImage = project.images && project.images.length > 0;
          const hasVideo = project.videos && project.videos.length > 0;

          return (
            <LazyLoad key={project.id} height={340} offset={100} once>
              <div
                className="group relative isolate aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[28px] bg-neutral-900 shadow-lg ring-1 ring-black/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 hover:ring-emerald-400/60 sm:aspect-[4/4.5]"
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
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-700 to-neutral-900 transition-transform duration-700 ease-out group-hover:scale-110" />
                )}

                {/* Legibility gradient, always on */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/0" />
                {/* Extra darken on hover so the CTA row pops */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />

                {/* Top badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {hasImage && project.images.length > 1 && (
                    <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {t('projects.moreCount', { count: project.images.length - 1 })}
                    </span>
                  )}
                  {hasVideo && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-sm text-white backdrop-blur-md">
                      ▶
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

                  <div className="mt-4 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      type="button"
                      className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-neutral-900 transition-colors duration-200 hover:bg-emerald-400"
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
                          <GitHubIcon sx={{ fontSize: 14 }} />
                        ) : (
                          <ArrowOutwardIcon sx={{ fontSize: 14 }} />
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
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        {!showAll && visibleCount < activeProjects.length && (
          <button
            type="button"
            onClick={handleLoadMore}
            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40"
          >
            {t('projects.seeMore')} ({activeProjects.length - visibleCount} {t('projects.more')})
          </button>
        )}

        {showAll && activeProjects.length > 6 && (
          <button
            type="button"
            onClick={handleShowLess}
            className="ml-3 rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-current transition-all duration-300 hover:scale-105 hover:bg-black/5"
          >
            {t('projects.seeLess')}
          </button>
        )}
      </Box>

      {/* Modal Dialog for Full Project Details */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={handleCloseModal}
        maxWidth={isMobile ? 'xs' : 'md'}
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '20px' },
          },
          backdrop: {
            sx: { backdropFilter: 'blur(4px)' },
          },
        }}
      >
        {selectedProject && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 1,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: '600', color: 'primary.main' }}>
                {localize(selectedProject.name, language)}
              </Typography>
              {getPrimaryLink(selectedProject) && (<Link href={getPrimaryLink(selectedProject)} target="_blank" rel="noopener noreferrer" sx={{ mr: 2 }}>
                <Button
                  size="medium"
                  variant="outlined"
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none',
                  }}
                >
                  {t('projects.view')}
                  {getLinkType(getPrimaryLink(selectedProject)) === 'github' ? <GitHubIcon sx={{ ml: 1 }} /> : <VisibilityIcon sx={{ ml: 1 }} />}
                </Button>
              </Link>)}
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {/* Images Section */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: '600', color: 'text.primary' }}>
                    {t('projects.images')}
                  </Typography>
                  <LazyLoad height={400} offset={100} once>
                    <ImageCarousel images={selectedProject.images} isMobile={isMobile} />
                  </LazyLoad>
                </Box>
              )}
              
              {/* Videos Section */}
              {selectedProject.videos && selectedProject.videos.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: '600', color: 'text.primary' }}>
                    {t('projects.videos')}
                  </Typography>
                  <LazyLoad height={400} offset={100} once>
                    <VideoCarousel videos={selectedProject.videos} isMobile={isMobile} />
                  </LazyLoad>
                </Box>
              )}
              
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: '1.125rem',
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {localize(selectedProject.fullDescription, language) || localize(selectedProject.description, language)}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                sx={{ color: 'secondary.main', borderColor: 'secondary.light', borderRadius: '50px', textTransform: 'none' }}
              >
                {t('projects.close')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </section>
  );
}

ProjectsSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      fullDescription: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.string),
      link: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]),
    })
  ).isRequired,
};

export default ProjectsSection;
