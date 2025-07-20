// Project Editor Component - Advanced form for managing project data
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
  InputAdornment
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon
} from '@mui/icons-material';
import { getCollectionData, setDocument } from '../../firebase/firestore';

const ProjectEditor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectsData, setProjectsData] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProjectsData();
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProjectsData = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData('projects');
      if (data.length > 0) {
        setProjectsData(data[0]);
        
        if (projectId === 'new') {
          // Create new project
          const newProject = createNewProject();
          setCurrentProject(newProject);
        } else {
          // Find existing project
          const project = data[0].data?.projects?.find(p => p.id === parseInt(projectId));
          if (project) {
            setCurrentProject(project);
          } else {
            setMessage({ type: 'error', text: 'Project not found' });
          }
        }
      } else {
        setMessage({ type: 'error', text: 'No projects data found' });
      }
    } catch (error) {
      console.error('Error loading projects data:', error);
      setMessage({ type: 'error', text: 'Failed to load projects data' });
    }
    setLoading(false);
  };

  const createNewProject = () => {
    const newId = Date.now(); // Simple ID generation
    return {
      id: newId,
      name: '',
      description: '',
      fullDescription: '',
      images: [],
      videos: [],
      link: []
    };
  };

  const handleSave = async () => {
    if (!currentProject.name.trim()) {
      setMessage({ type: 'error', text: 'Project name is required' });
      return;
    }

    setSaving(true);
    try {
      let updatedProjects;
      
      if (projectId === 'new') {
        // Add new project
        updatedProjects = [
          ...(projectsData.data?.projects || []),
          currentProject
        ];
      } else {
        // Update existing project
        updatedProjects = (projectsData.data?.projects || []).map(p => 
          p.id === currentProject.id ? currentProject : p
        );
      }

      const updatedProjectsData = {
        ...projectsData,
        data: {
          ...projectsData.data,
          projects: updatedProjects
        }
      };

      const success = await setDocument('projects', 'projects', updatedProjectsData);
      
      if (success) {
        setMessage({ type: 'success', text: 'Project saved successfully!' });
        if (projectId === 'new') {
          // Redirect to edit the newly created project
          setTimeout(() => {
            navigate(`/admin/projects/${currentProject.id}`);
          }, 1500);
        }
      } else {
        setMessage({ type: 'error', text: 'Failed to save project' });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setMessage({ type: 'error', text: 'Failed to save project' });
    }
    setSaving(false);
  };

  const updateProject = (field, value) => {
    setCurrentProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field, item) => {
    if (item.trim()) {
      setCurrentProject(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), item.trim()]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setCurrentProject(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!currentProject) {
    return (
      <Container>
        <Alert severity="error">
          Project not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {projectId === 'new' ? 'Create New Project' : 'Edit Project'}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/admin')}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Project'}
          </Button>
        </Box>
      </Box>

      {/* Message Alert */}
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      {/* Editor Content */}
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name *"
                  value={currentProject.name || ''}
                  onChange={(e) => updateProject('name', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Short Description"
                  value={currentProject.description || ''}
                  onChange={(e) => updateProject('description', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Full Description"
                  value={currentProject.fullDescription || ''}
                  onChange={(e) => updateProject('fullDescription', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Project Links */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Links
            </Typography>
            
            <Box mb={2}>
              {(currentProject.link || []).map((link, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <Chip
                    icon={<LinkIcon />}
                    label={link}
                    onDelete={() => removeArrayItem('link', index)}
                    sx={{ mr: 1, maxWidth: '300px' }}
                  />
                </Box>
              ))}
            </Box>
            
            <FormControl fullWidth variant="outlined">
              <InputLabel>Add Project Link</InputLabel>
              <OutlinedInput
                label="Add Project Link"
                placeholder="https://github.com/..."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(e) => {
                        const input = e.target.closest('.MuiOutlinedInput-root').querySelector('input');
                        if (input && input.value.trim()) {
                          addArrayItem('link', input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addArrayItem('link', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </FormControl>
          </Paper>
        </Grid>

        {/* Project Images */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Images
            </Typography>
            
            <Box mb={2}>
              {(currentProject.images || []).map((image, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <Chip
                    icon={<ImageIcon />}
                    label={`Image ${index + 1}`}
                    onDelete={() => removeArrayItem('images', index)}
                    sx={{ mr: 1 }}
                  />
                </Box>
              ))}
            </Box>
            
            <FormControl fullWidth variant="outlined">
              <InputLabel>Add Image URL</InputLabel>
              <OutlinedInput
                label="Add Image URL"
                placeholder="https://example.com/image.jpg"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(e) => {
                        const input = e.target.closest('.MuiOutlinedInput-root').querySelector('input');
                        if (input && input.value.trim()) {
                          addArrayItem('images', input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addArrayItem('images', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => navigate('/admin/media')}
              sx={{ mt: 2 }}
              fullWidth
            >
              Upload New Images
            </Button>
          </Paper>
        </Grid>

        {/* Project Videos */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Videos
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box mb={2}>
                  {(currentProject.videos || []).map((video, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={1}>
                      <Chip
                        icon={<VideoIcon />}
                        label={`Video ${index + 1}`}
                        onDelete={() => removeArrayItem('videos', index)}
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  ))}
                </Box>
                
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Add Video URL</InputLabel>
                  <OutlinedInput
                    label="Add Video URL"
                    placeholder="https://example.com/video.mp4"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            const input = e.target.closest('.MuiOutlinedInput-root').querySelector('input');
                            if (input && input.value.trim()) {
                              addArrayItem('videos', input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem('videos', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => navigate('/admin/media')}
                  fullWidth
                  sx={{ height: '56px' }}
                >
                  Upload Videos
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Preview */}
        {currentProject.name && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {currentProject.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {currentProject.description}
                  </Typography>
                  {currentProject.fullDescription && (
                    <Typography variant="body2" paragraph>
                      {currentProject.fullDescription}
                    </Typography>
                  )}
                  
                  <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                    {(currentProject.link || []).map((link, index) => (
                      <Chip
                        key={index}
                        icon={<LinkIcon />}
                        label="Link"
                        component="a"
                        href={link}
                        target="_blank"
                        clickable
                        size="small"
                      />
                    ))}
                    {currentProject.images?.length > 0 && (
                      <Chip
                        icon={<ImageIcon />}
                        label={`${currentProject.images.length} Images`}
                        size="small"
                        color="primary"
                      />
                    )}
                    {currentProject.videos?.length > 0 && (
                      <Chip
                        icon={<VideoIcon />}
                        label={`${currentProject.videos.length} Videos`}
                        size="small"
                        color="secondary"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ProjectEditor;