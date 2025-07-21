// Firebase Storage utilities with user-based folder structure
import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './config';
import { v4 as uuidv4 } from 'uuid';

// Upload file to user-specific folder in Firebase Storage
export const uploadUserFile = async (file, userId, folder = 'media', onProgress = null) => {
  try {
    // Create a unique filename
    const fileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `users/${userId}/${folder}/${fileName}`);

    if (onProgress) {
      // Use resumable upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ success: true, downloadURL, fileName, filePath: storageRef.fullPath });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      // Simple upload without progress tracking
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return { success: true, downloadURL, fileName, filePath: storageRef.fullPath };
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error.message };
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file, userId, onProgress = null) => {
  return uploadUserFile(file, userId, 'profile', onProgress);
};

// Upload CV (PDF)
export const uploadCV = async (file, userId, onProgress = null) => {
  if (file.type !== 'application/pdf') {
    return { success: false, error: 'CV must be a PDF file' };
  }
  return uploadUserFile(file, userId, 'cv', onProgress);
};

// Upload project media (images/videos)
export const uploadProjectMedia = async (file, userId, onProgress = null) => {
  const isImage = isValidImageFile(file);
  const isVideo = isValidVideoFile(file);
  
  if (!isImage && !isVideo) {
    return { success: false, error: 'File must be an image or video' };
  }
  
  return uploadUserFile(file, userId, 'projects', onProgress);
};

// Delete file from Firebase Storage using file path
export const deleteUserFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

// Upload multiple files to user folder
export const uploadMultipleUserFiles = async (files, userId, folder = 'media', onProgress = null) => {
  try {
    const uploadPromises = files.map((file, index) => {
      return uploadUserFile(file, userId, folder, onProgress ? (progress) => {
        onProgress(index, progress);
      } : null);
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    return { success: false, error: error.message };
  }
};

// Legacy upload function for backward compatibility
export const uploadFile = async (file, folder = 'uploads', onProgress = null) => {
  return uploadUserFile(file, 'default-user', folder, onProgress);
};

// Helper function to get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Helper function to validate file type
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

export const isValidVideoFile = (file) => {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
  return validTypes.includes(file.type);
};

// Helper function to format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};