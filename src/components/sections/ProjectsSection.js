import React, { useState } from 'react';
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
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';

function useProjectsState() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProject, setSelectedProject] = useState(null);
  return { visibleCount, setVisibleCount, selectedProject, setSelectedProject };
}

// Image carousel component with centered image
function ImageCarousel({ images }) {
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
      <img
        src={images[currentIndex]}
        alt={`Project ${currentIndex + 1}`}
        style={{ maxHeight:'65vh', maxWidth: '100%', height: 'auto', borderRadius: '8px', margin: '0 auto' }}
      />
      {images.length > 1 && (
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

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

function ProjectsSection({ id, title, content, projects }) {
  const { visibleCount, setVisibleCount, selectedProject, setSelectedProject } = useProjectsState();

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

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Filter only active projects and sort by order if available
  const activeProjects = projects
    .filter(project => project.active !== false) // Show projects that are not explicitly inactive
    .sort((a, b) => (a.order || 999) - (b.order || 999)); // Sort by order, fallback to end if no order

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
      <Grid container  justifyContent="space-between" sx={{ maxWidth: '84%', margin: 'auto' }}>
        {visibleProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{
                height: '370px', // Fixed height to ensure uniform cards
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: 1,
                m: 2,
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
                <Box sx={{ height: 180, overflow: 'hidden', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                  <img
                    src={project.images[0]}
                    alt={`${project.name} thumbnail`}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
              ) : (
                // Placeholder box if no image is available to maintain the same card height
                <Box sx={{ height: 180, backgroundColor: 'grey.200', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
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
                  variant="contained"
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
          </Grid>
        ))}
      </Grid>

      {visibleCount < activeProjects.length && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontSize: '1rem',
              px: 3,
              py: 1,
            }}
          >
            See More
          </Button>
        </Box>
      )}

      {/* Modal Dialog for Full Project Details */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={handleCloseModal}
        maxWidth="md"
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
              {selectedProject.videos && selectedProject.videos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {selectedProject.videos.map((video, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <video
                        controls
                        style={{ width: '100%', maxHeight: '70vh', borderRadius: '8px' }}
                      >
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </Box>
                  ))}
                </Box>
              )}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <ImageCarousel maxHeight='500px' images={selectedProject.images} />
              )}
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: '1.125rem',
                  color: 'text.secondary',
                  lineHeight: 1.6,
                }}
              >
                {selectedProject.fullDescription || selectedProject.description}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                sx={{ borderRadius: '50px', textTransform: 'none' }}
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
