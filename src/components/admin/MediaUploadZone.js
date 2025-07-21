import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Alert,
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { 
  uploadUserFile, 
  uploadProfilePicture,
  uploadCV,
  uploadProjectMedia,
  deleteUserFile,
  isValidImageFile,
  isValidVideoFile,
  formatFileSize
} from '../../firebase/storage';
import { useAuth } from '../../contexts/AuthContext';

const MediaUploadZone = ({ 
  onUploadComplete, 
  uploadType = 'general', // 'profile', 'cv', 'project', 'general'
  maxFiles = 10,
  accept = null
}) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');

  const getAcceptedTypes = () => {
    switch (uploadType) {
      case 'profile':
        return { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] };
      case 'cv':
        return { 'application/pdf': ['.pdf'] };
      case 'project':
        return {
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
          'video/*': ['.mp4', '.webm', '.ogg', '.avi', '.mov']
        };
      default:
        return accept || {
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
          'video/*': ['.mp4', '.webm', '.ogg', '.avi', '.mov'],
          'application/pdf': ['.pdf']
        };
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!currentUser) {
      setError('You must be logged in to upload files');
      return;
    }

    setUploading(true);
    setError('');
    const newUploadProgress = {};

    try {
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        const fileId = `file-${Date.now()}-${index}`;
        newUploadProgress[fileId] = 0;
        setUploadProgress({ ...newUploadProgress });

        const onProgress = (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: progress
          }));
        };

        let uploadFunction;
        switch (uploadType) {
          case 'profile':
            uploadFunction = uploadProfilePicture;
            break;
          case 'cv':
            uploadFunction = uploadCV;
            break;
          case 'project':
            uploadFunction = uploadProjectMedia;
            break;
          default:
            uploadFunction = uploadUserFile;
        }

        const result = await uploadFunction(file, currentUser.uid, onProgress);
        
        if (result.success) {
          return {
            id: fileId,
            file,
            downloadURL: result.downloadURL,
            fileName: result.fileName,
            filePath: result.filePath,
            type: file.type,
            size: file.size
          };
        } else {
          throw new Error(result.error);
        }
      });

      const results = await Promise.all(uploadPromises);
      const newUploadedFiles = [...uploadedFiles, ...results];
      setUploadedFiles(newUploadedFiles);
      
      if (onUploadComplete) {
        onUploadComplete(newUploadedFiles);
      }

    } catch (err) {
      setError(err.message);
    }

    setUploading(false);
    setUploadProgress({});
  }, [currentUser, uploadType, uploadedFiles, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedTypes(),
    maxFiles: maxFiles,
    disabled: uploading
  });

  const handleDeleteFile = async (fileToDelete) => {
    try {
      await deleteUserFile(fileToDelete.filePath);
      const updatedFiles = uploadedFiles.filter(file => file.id !== fileToDelete.id);
      setUploadedFiles(updatedFiles);
      
      if (onUploadComplete) {
        onUploadComplete(updatedFiles);
      }
    } catch (err) {
      setError(`Failed to delete file: ${err.message}`);
    }
  };

  const renderFilePreview = (file) => {
    const isImage = isValidImageFile({ type: file.type });
    const isVideo = isValidVideoFile({ type: file.type });
    const isPDF = file.type === 'application/pdf';

    return (
      <Grid item xs={12} sm={6} md={4} key={file.id}>
        <Card>
          {isImage && (
            <CardMedia
              component="img"
              height="200"
              image={file.downloadURL}
              alt={file.fileName}
              sx={{ objectFit: 'cover' }}
            />
          )}
          {isVideo && (
            <CardMedia
              component="video"
              height="200"
              controls
              sx={{ objectFit: 'cover' }}
            >
              <source src={file.downloadURL} type={file.type} />
            </CardMedia>
          )}
          {isPDF && (
            <Box 
              sx={{ 
                height: 200, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'grey.100'
              }}
            >
              <Typography variant="h4" color="text.secondary">
                📄
              </Typography>
            </Box>
          )}
          
          <CardContent>
            <Typography variant="body2" noWrap title={file.fileName}>
              {file.fileName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(file.size)}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={file.type} 
                size="small" 
                variant="outlined" 
              />
            </Box>
          </CardContent>
          
          <CardActions>
            <IconButton 
              size="small"
              href={file.downloadURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DownloadIcon />
            </IconButton>
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
    );
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Upload Zone */}
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          bgcolor: isDragActive ? 'primary.50' : 'grey.50',
          transition: 'all 0.2s ease',
          mb: 3
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          or click to select files
        </Typography>
        <Button variant="outlined" disabled={uploading} sx={{ mt: 2 }}>
          Choose Files
        </Button>
      </Box>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Uploading files...
          </Typography>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <Box key={fileId} sx={{ mb: 1 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Uploaded Files ({uploadedFiles.length})
          </Typography>
          <Grid container spacing={2}>
            {uploadedFiles.map(renderFilePreview)}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MediaUploadZone;