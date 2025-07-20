// Media Upload Component for Admin Panel
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  IconButton,
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  ArrowBack as BackIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon
} from '@mui/icons-material';
import { 
  uploadMultipleFiles, 
  deleteFile, 
  isValidImageFile, 
  isValidVideoFile, 
  formatFileSize 
} from '../../firebase/storage';

const MediaUpload = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const fileArray = Array.from(files);
      
      // Validate files
      const invalidFiles = fileArray.filter(file => 
        !isValidImageFile(file) && !isValidVideoFile(file)
      );
      
      if (invalidFiles.length > 0) {
        setMessage({ 
          type: 'error', 
          text: 'Some files are not valid. Please upload only images (JPEG, PNG, GIF, WebP) or videos (MP4, WebM, OGG).' 
        });
        setUploading(false);
        return;
      }

      // Upload files
      const results = await uploadMultipleFiles(fileArray, 'portfolio-media', (index, progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [index]: progress
        }));
      });

      // Process results
      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      if (successfulUploads.length > 0) {
        const newFiles = successfulUploads.map((result, index) => ({
          id: Date.now() + index,
          name: fileArray[index].name,
          url: result.downloadURL,
          fileName: result.fileName,
          type: isValidImageFile(fileArray[index]) ? 'image' : 'video',
          size: fileArray[index].size,
          uploadedAt: new Date().toISOString()
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
        setMessage({ 
          type: 'success', 
          text: `Successfully uploaded ${successfulUploads.length} file(s)` 
        });
      }

      if (failedUploads.length > 0) {
        setMessage({ 
          type: 'error', 
          text: `Failed to upload ${failedUploads.length} file(s)` 
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    }

    setUploading(false);
    setUploadProgress({});
  }, []);

  const handleDeleteFile = async (file) => {
    try {
      const result = await deleteFile(file.url);
      if (result.success) {
        setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
        setMessage({ type: 'success', text: 'File deleted successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete file' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: 'Failed to delete file' });
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setMessage({ type: 'success', text: 'URL copied to clipboard!' });
    }).catch(() => {
      setMessage({ type: 'error', text: 'Failed to copy URL' });
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/admin')} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Media Upload Manager
        </Typography>
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

      {/* Upload Area */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 3, 
          border: '2px dashed #ccc',
          backgroundColor: uploading ? 'action.hover' : 'background.paper',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          if (!uploading) {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*,video/*';
            input.onchange = (e) => handleFileUpload(e.target.files);
            input.click();
          }
        }}
      >
        <Box textAlign="center">
          <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG)
          </Typography>
          
          {uploading && (
            <Box sx={{ mt: 3 }}>
              {Object.entries(uploadProgress).map(([index, progress]) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    File {parseInt(index) + 1}: {Math.round(progress)}%
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Instructions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          How to use uploaded media:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <Typography variant="body2">
              After uploading, copy the file URL by clicking the copy button
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Use the URL in your content sections (intro image, project images, etc.)
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              For project images/videos, add the URL to the images or videos array
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Files are stored in Firebase Storage and will be accessible from anywhere
            </Typography>
          </li>
        </Box>
      </Paper>

      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Uploaded Files ({uploadedFiles.length})
          </Typography>
          <Grid container spacing={2}>
            {uploadedFiles.map((file) => (
              <Grid item xs={12} sm={6} md={4} key={file.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {file.type === 'image' ? (
                        <ImageIcon color="primary" sx={{ mr: 1 }} />
                      ) : (
                        <VideoIcon color="secondary" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>
                        {file.name}
                      </Typography>
                    </Box>
                    
                    {file.type === 'image' && (
                      <Box
                        component="img"
                        src={file.url}
                        alt={file.name}
                        sx={{
                          width: '100%',
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mb: 2
                        }}
                      />
                    )}

                    <Chip 
                      label={file.type.toUpperCase()} 
                      size="small" 
                      color={file.type === 'image' ? 'primary' : 'secondary'}
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={formatFileSize(file.size)} 
                      size="small" 
                      variant="outlined"
                    />

                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mt: 1, wordBreak: 'break-all' }}
                    >
                      {file.url}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<CopyIcon />}
                      onClick={() => copyToClipboard(file.url)}
                    >
                      Copy URL
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteFile(file)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default MediaUpload;