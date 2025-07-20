// Section Editor Component for Admin Panel
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
  Card,
  CardContent
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { getCollectionData, setDocument } from '../../firebase/firestore';

const SectionEditor = () => {
  const { sectionType } = useParams();
  const navigate = useNavigate();
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSectionData();
  }, [sectionType]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSectionData = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData(sectionType);
      if (data.length > 0) {
        setSectionData(data[0]); // Assuming one document per section
      } else {
        // Create default structure based on section type
        setSectionData(createDefaultSectionData(sectionType));
      }
    } catch (error) {
      console.error('Error loading section data:', error);
      setMessage({ type: 'error', text: 'Failed to load section data' });
    }
    setLoading(false);
  };

  const createDefaultSectionData = (type) => {
    const defaults = {
      intro: {
        id: 'intro',
        name: 'Your Name',
        title: 'Introduction',
        type: 'intro',
        content: 'Your introduction content here...',
        data: {
          subtitle: 'Your Professional Title',
          highlight: 'Your highlight message',
          image: '',
          cvLink: ''
        }
      },
      capabilities: {
        id: 'capabilities',
        title: 'What Can I Do?',
        type: 'capabilities',
        content: 'Describe your capabilities here...'
      },
      skills: {
        id: 'skills',
        title: 'Skills',
        type: 'skills',
        content: 'Skills overview...',
        data: {
          skillsList: {
            'Front-End': [],
            'Back-End': [],
            'Databases': [],
            'Tools & Other': []
          }
        }
      },
      projects: {
        id: 'projects',
        title: 'Projects',
        type: 'projects',
        content: 'Here are some of my projects...',
        data: {
          projects: []
        }
      },
      education: {
        id: 'education',
        title: 'Education',
        type: 'education',
        content: '',
        data: {
          educationList: []
        }
      },
      experience: {
        id: 'experience',
        title: 'My Experience',
        type: 'experience',
        experience: []
      }
    };

    return defaults[type] || { id: type, title: type, type: type, content: '' };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await setDocument(sectionType, sectionData.id, sectionData);
      if (success) {
        setMessage({ type: 'success', text: 'Section saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save section' });
      }
    } catch (error) {
      console.error('Error saving section:', error);
      setMessage({ type: 'error', text: 'Failed to save section' });
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setSectionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parentField, childField, value) => {
    setSectionData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
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

  if (!sectionData) {
    return (
      <Container>
        <Alert severity="error">
          Section not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Edit {sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section
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
            {saving ? 'Saving...' : 'Save'}
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
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Fields */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              value={sectionData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </Grid>

          {sectionData.name && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={sectionData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={sectionData.content || ''}
              onChange={(e) => updateField('content', e.target.value)}
            />
          </Grid>

          {/* Section-specific fields */}
          {sectionType === 'intro' && sectionData.data && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Introduction Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subtitle"
                  value={sectionData.data.subtitle || ''}
                  onChange={(e) => updateNestedField('data', 'subtitle', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Highlight"
                  value={sectionData.data.highlight || ''}
                  onChange={(e) => updateNestedField('data', 'highlight', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={sectionData.data.image || ''}
                  onChange={(e) => updateNestedField('data', 'image', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CV Link"
                  value={sectionData.data.cvLink || ''}
                  onChange={(e) => updateNestedField('data', 'cvLink', e.target.value)}
                />
              </Grid>
            </>
          )}

          {/* Skills Section */}
          {sectionType === 'skills' && sectionData.data && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Skills Categories
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Manage your skills by category. Click on a skill to edit or remove it.
                </Typography>
              </Grid>
              {Object.entries(sectionData.data.skillsList || {}).map(([category, skills]) => (
                <Grid item xs={12} md={6} key={category}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {category}
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            onDelete={() => {
                              const newSkills = skills.filter((_, i) => i !== index);
                              setSectionData(prev => ({
                                ...prev,
                                data: {
                                  ...prev.data,
                                  skillsList: {
                                    ...prev.data.skillsList,
                                    [category]: newSkills
                                  }
                                }
                              }));
                            }}
                          />
                        ))}
                        <Chip
                          icon={<AddIcon />}
                          label="Add Skill"
                          onClick={() => {
                            const newSkill = prompt(`Add new skill to ${category}:`);
                            if (newSkill && newSkill.trim()) {
                              setSectionData(prev => ({
                                ...prev,
                                data: {
                                  ...prev.data,
                                  skillsList: {
                                    ...prev.data.skillsList,
                                    [category]: [...skills, newSkill.trim()]
                                  }
                                }
                              }));
                            }
                          }}
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </>
          )}

          {/* File Upload Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Media Files
            </Typography>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => navigate('/admin/media')}
            >
              Manage Media Files
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SectionEditor;