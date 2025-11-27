import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
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
import PropTypes from 'prop-types';

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
          {title}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.25rem', color: 'text.secondary' }}>
          {content}
        </Typography>
        <Typography color="error">No projects available.</Typography>
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
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 'bold',
          mb: 3,
          color: 'primary.main',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      
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
        {content}
      </Typography>
      <Grid container  justifyContent="space-between" sx={{ maxWidth: { xs: '95%', md: '84%' }, margin: 'auto' }}>
        {visibleProjects.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <LazyLoad height={370} offset={100} once>
            <Card
              sx={{
                height: '370px', // Fixed height to ensure uniform cards
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: 1,
                m: { xs: 1, md: 2 },
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4,
                },
                cursor: 'pointer',
              }}
              onClick={() => handleOpenModal(project)}
            >
              {/* Reserved space for the image or a placeholder box */}
              {project.images && project.images.length > 0 ? (
                <Box sx={{ height: 180, overflow: 'hidden', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', position: 'relative' }}>
                  <picture>
                    <source 
                      srcSet={project.images[0].startsWith('http') ? project.images[0] : `/${project.images[0]}`} 
                      type="image/webp" 
                    />
                    <img
                      src={project.images[0].startsWith('http') ? project.images[0] : `/${project.images[0]}`}
                      alt={`${project.name} thumbnail`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                  {project.images.length > 1 && (
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(21, 21, 21, 0.6)',
                      color: 'white',
                      fontSize: '0.75rem',
                      px: 1,
                      py: 0.3,
                      borderRadius: 2
                    }}>
                      +{project.images.length - 1} more
                    </Box>
                  )}
                  {project.videos && project.videos.length > 0 && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      backgroundColor: 'rgba(114, 114, 114, 0.8)',
                      color: 'white',
                      fontSize: '1rem',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      ▶
                    </Box>
                  )}
                </Box>
              ) : project.videos && project.videos.length > 0 ? (
                <Box sx={{ height: 180, overflow: 'hidden', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', position: 'relative' }}>
                  <video
                    src={project.videos[0].startsWith('http') ? project.videos[0] : `/${project.videos[0]}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                    playsInline
                  />
                  <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    '&:hover': { opacity: 1 }
                  }}>
                    <Box sx={{ fontSize: '3rem', color: 'white' }}>▶</Box>
                  </Box>
                  {project.videos.length > 1 && (
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      fontSize: '0.75rem',
                      px: 1,
                      py: 0.5,
                      borderRadius: 4
                    }}>
                      +{project.videos.length - 1} more
                    </Box>
                  )}
                </Box>
              ) : (
                // Placeholder box if no image is available to maintain the same card height
                <Box sx={{ 
                  height: 180, 
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
                  borderTopLeftRadius: '16px', 
                  borderTopRightRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{ textAlign: 'center', color: 'text.disabled' }}>
                    <Box sx={{ fontSize: '3rem', mb: 1, opacity: 0.5 }}>📄</Box>
                    <Typography variant="caption">No media available</Typography>
                  </Box>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: '600' }}>
                  {project.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {project.fullDescription || project.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="medium"
                  variant="outlined"
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(project);
                  }}
                >
                  More Info
                </Button>
                {getPrimaryLink(project) && (
                  <Link href={getPrimaryLink(project)} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size="medium"
                      variant="outlined"
                      sx={{
                        borderRadius: '50px',
                        textTransform: 'none',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
                      {getLinkType(getPrimaryLink(project)) === 'github' ? <GitHubIcon sx={{ ml: 1 }} /> : <VisibilityIcon sx={{ ml: 1 }} />}
                    </Button>
                  </Link>
                )}
              </CardActions>
            </Card>
            </LazyLoad>
          </Grid>
        ))}
      </Grid>

      {/* See More / See Less Button */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        {!showAll && visibleCount < activeProjects.length && (
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            sx={{
              borderRadius: '60px',
              textTransform: 'none',
              fontSize: '1rem',
              px: 3,
              py: 1,
              mr: 2,
            }}
          >
            See More ({activeProjects.length - visibleCount} more)
          </Button>
        )}
        
        {showAll && activeProjects.length > 6 && (
          <Button
            variant="outlined"
            onClick={handleShowLess}
            sx={{
              borderRadius: '60px',
              textTransform: 'none',
              fontSize: '1rem',
              px: 3,
              py: 1,
            }}
          >
            See Less
          </Button>
        )}
      </Box>

      {/* Modal Dialog for Full Project Details */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={handleCloseModal}
        maxWidth={isMobile ? 'xs' : 'md'}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
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
                {selectedProject.name}
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
                  View
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
                    Project Images
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
                    Project Videos
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
                {selectedProject.fullDescription || selectedProject.description}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                sx={{ color: 'secondary.main', borderColor: 'secondary.light', borderRadius: '50px', textTransform: 'none' }}
              >
                Close
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
