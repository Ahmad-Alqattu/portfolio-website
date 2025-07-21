// Enhanced Project Editor with Media Upload Support
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Chip,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Divider,
  CardMedia,
  CardActions
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { getSection, updateSection } from '../../firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import MediaUploadZone from './MediaUploadZone';

const EnhancedProjectEditor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [projectsData, setProjectsData] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: [],
    links: [],
    features: [],
    images: [],
    videos: []
  });

  useEffect(() => {
    loadProjectsData();
  }, [projectId]);

  const loadProjectsData = async () => {
    setLoading(true);
    try {
      const projectsSection = await getSection('projects', currentUser.uid);
      if (projectsSection && projectsSection.data && projectsSection.data.projectsList) {
        setProjectsData(projectsSection);
        
        // Find the specific project
        const project = projectsSection.data.projectsList.find(p => p.id === projectId);
        if (project) {
          setCurrentProject(project);
          setProjectForm({
            title: project.title || '',
            description: project.description || '',
            technologies: project.technologies || [],
            links: project.links || [],
            features: project.features || [],
            images: project.images || [],
            videos: project.videos || []
          });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load project data' });
    }
    setLoading(false);
  };

  const handleSaveProject = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Update the project in the projects list
      const updatedProjects = projectsData.data.projectsList.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            ...projectForm,
            lastUpdated: new Date().toISOString()
          };
        }
        return project;
      });

      // Update the entire projects section
      const updatedProjectsData = {
        ...projectsData,
        data: {
          ...projectsData.data,
          projectsList: updatedProjects
        },
        lastUpdated: new Date().toISOString()
      };

      const result = await updateSection('projects', updatedProjectsData, currentUser.uid);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Project updated successfully!' });
        setProjectsData(updatedProjectsData);
        setCurrentProject({ ...currentProject, ...projectForm });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update project' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating the project' });
    }

    setSaving(false);
  };

  const handleInputChange = (field, value) => {
    setProjectForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field, item) => {
    setProjectForm(prev => ({
      ...prev,
      [field]: [...prev[field], item]
    }));
  };

  const handleArrayRemove = (field, index) => {
    setProjectForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleMediaUpload = (files, type) => {
    const mediaItems = files.map(file => ({
      id: `${type}-${Date.now()}-${Math.random()}`,
      url: file.downloadURL,
      fileName: file.fileName,
      type: file.type,
      caption: ''
    }));

    setProjectForm(prev => ({
      ...prev,
      [type]: [...prev[type], ...mediaItems]
    }));
  };

  const renderMediaGrid = (mediaList, type) => {
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {mediaList.map((media, index) => (
          <Grid item xs={12} sm={6} md={4} key={media.id || index}>
            <Card>
              {type === 'images' ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={media.url}
                  alt={media.caption || `Project ${type}`}
                />
              ) : (
                <CardMedia
                  component="video"
                  height="200"
                  controls
                  sx={{ objectFit: 'cover' }}
                >
                  <source src={media.url} type={media.type} />
                </CardMedia>
              )}
              <CardContent>
                <TextField
                  fullWidth
                  size="small"
                  label="Caption"
                  value={media.caption || ''}
                  onChange={(e) => {
                    const updatedMedia = [...projectForm[type]];
                    updatedMedia[index].caption = e.target.value;
                    setProjectForm(prev => ({
                      ...prev,
                      [type]: updatedMedia
                    }));
                  }}
                />
              </CardContent>
              <CardActions>
                <IconButton
                  color="error"
                  onClick={() => handleArrayRemove(type, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading project...</Typography>
      </Container>
    );
  }

  if (!currentProject) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Project not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/content')} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4">
          Edit Project: {currentProject.title}
        </Typography>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Title"
                  value={projectForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Project Description"
                  value={projectForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Technologies */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Technologies Used
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {projectForm.technologies.map((tech, index) => (
                <Chip
                  key={index}
                  label={tech}
                  onDelete={() => handleArrayRemove('technologies', index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add technology"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleArrayAdd('technologies', e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={(e) => {
                  const input = e.currentTarget.parentElement.querySelector('input');
                  if (input.value.trim()) {
                    handleArrayAdd('technologies', input.value.trim());
                    input.value = '';
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Project Links */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Links
            </Typography>
            
            {projectForm.links.map((link, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Link title"
                  value={link.title || ''}
                  onChange={(e) => {
                    const updatedLinks = [...projectForm.links];
                    updatedLinks[index].title = e.target.value;
                    setProjectForm(prev => ({ ...prev, links: updatedLinks }));
                  }}
                />
                <TextField
                  size="small"
                  placeholder="URL"
                  value={link.url || ''}
                  onChange={(e) => {
                    const updatedLinks = [...projectForm.links];
                    updatedLinks[index].url = e.target.value;
                    setProjectForm(prev => ({ ...prev, links: updatedLinks }));
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleArrayRemove('links', index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => handleArrayAdd('links', { title: '', url: '' })}
              fullWidth
            >
              Add Link
            </Button>
          </Paper>
        </Grid>

        {/* Project Images */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Images
            </Typography>
            
            <MediaUploadZone
              uploadType="project"
              maxFiles={10}
              onUploadComplete={(files) => handleMediaUpload(files, 'images')}
              accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] }}
            />

            {projectForm.images.length > 0 && renderMediaGrid(projectForm.images, 'images')}
          </Paper>
        </Grid>

        {/* Project Videos */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Videos
            </Typography>
            
            <MediaUploadZone
              uploadType="project"
              maxFiles={5}
              onUploadComplete={(files) => handleMediaUpload(files, 'videos')}
              accept={{ 'video/*': ['.mp4', '.webm', '.ogg', '.avi', '.mov'] }}
            />

            {projectForm.videos.length > 0 && renderMediaGrid(projectForm.videos, 'videos')}
          </Paper>
        </Grid>

        {/* Save Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/admin/content')}
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSaveProject}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Project'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EnhancedProjectEditor;