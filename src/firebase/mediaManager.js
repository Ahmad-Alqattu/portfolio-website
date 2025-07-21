// Firebase Storage Media Manager - Simple and Reliable
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage, auth } from './config';

class MediaManager {
  constructor(userId = null) {
    this.userId = userId || this.getCurrentUserId();
    this.basePath = `users/${this.userId}/media`;
  }

  getCurrentUserId() {
    try {
      const currentUser = auth.currentUser;
      return currentUser ? currentUser.uid : 'default-user';
    } catch (error) {
      return 'default-user';
    }
  }

  setUserId(userId) {
    this.userId = userId;
    this.basePath = `users/${userId}/media`;
  }

  async uploadFile(file, category = 'general') {
    try {
      // Allow uploads even without authentication - use public folder
      let uploadPath;
      if (this.userId === 'default-user') {
        uploadPath = `public/media/${category}`;
      } else {
        uploadPath = `${this.basePath}/${category}`;
      }

      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const fileRef = ref(storage, `${uploadPath}/${fileName}`);

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      return {
        success: true,
        file: {
          name: fileName,
          originalName: file.name,
          url: downloadURL,
          path: fileRef.fullPath,
          category: category,
          size: file.size,
          type: file.type
        }
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadMultipleFiles(files, category = 'general') {
    const results = {
      successful: [],
      failed: [],
      totalUploaded: 0,
      totalFailed: 0
    };

    for (const file of files) {
      const result = await this.uploadFile(file, category);
      if (result.success) {
        results.successful.push(result.file);
        results.totalUploaded++;
      } else {
        results.failed.push({ file: file.name, error: result.error });
        results.totalFailed++;
      }
    }

    return results;
  }

  async deleteFile(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  }

  async listFiles(folder = 'general') {
    try {
      if (this.userId === 'default-user') {
        console.log('No authenticated user - returning empty file list');
        return { success: true, files: [] };
      }

      const folderRef = ref(storage, `${this.basePath}/${folder}`);
      const result = await listAll(folderRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            return {
              name: itemRef.name,
              path: itemRef.fullPath,
              url: url
            };
          } catch (error) {
            console.warn(`Failed to get download URL for ${itemRef.name}:`, error);
            return null;
          }
        })
      );
      
      return { 
        success: true, 
        files: files.filter(file => file !== null) 
      };
    } catch (error) {
      console.warn(`Error listing files in ${folder}:`, error);
      return { success: true, files: [] };
    }
  }

  async getMediaByType() {
    try {
      const folders = ['images', 'videos', 'documents', 'general'];
      const mediaData = {};
      
      for (const folder of folders) {
        const result = await this.listFiles(folder);
        mediaData[folder] = result.files || [];
      }
      
      return { success: true, mediaData };
    } catch (error) {
      console.warn('Error getting media by type:', error);
      return { 
        success: true, 
        mediaData: { images: [], videos: [], documents: [], general: [] }
      };
    }
  }

  validateFile(file, maxSize = 10 * 1024 * 1024) {
    const allowedTypes = {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      videos: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
      documents: [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
    };

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    const allAllowedTypes = Object.values(allowedTypes).flat();
    if (!allAllowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    return { valid: true };
  }

  getFileCategory(fileType) {
    if (fileType.startsWith('image/')) return 'images';
    if (fileType.startsWith('video/')) return 'videos';
    if (fileType.includes('pdf') || fileType.includes('document') || fileType === 'text/plain') return 'documents';
    return 'general';
  }
}

// Create singleton that can be updated when user logs in
class MediaManagerSingleton {
  constructor() {
    this.instance = new MediaManager();
  }

  updateUser(userId) {
    this.instance.setUserId(userId);
  }

  // Proxy all methods to the current instance
  uploadFile(...args) { 
    return this.instance.uploadFile(...args); 
  }
  
  uploadMultipleFiles(...args) { 
    return this.instance.uploadMultipleFiles(...args); 
  }
  
  deleteFile(...args) { 
    return this.instance.deleteFile(...args); 
  }
  
  listFiles(...args) { 
    return this.instance.listFiles(...args); 
  }
  
  getMediaByType(...args) { 
    return this.instance.getMediaByType(...args); 
  }
  
  validateFile(...args) { 
    return this.instance.validateFile(...args); 
  }
  
  getFileCategory(...args) { 
    return this.instance.getFileCategory(...args); 
  }
}

// Export the singleton instance
export const mediaManager = new MediaManagerSingleton();
