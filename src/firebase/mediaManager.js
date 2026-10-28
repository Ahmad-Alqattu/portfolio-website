// Firebase Storage Media Manager - Simple and Reliable
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './storageConfig';

// Every image uploaded through the admin panel — profile photo, project
// screenshots, company/institution logos — comes through this one function,
// so this is where oversized uploads get caught before they ever reach
// production. Downscales to a generous max dimension and re-encodes as WebP;
// skips anything already small (nothing to gain) and falls back to the
// original file on any failure rather than blocking the upload.
const RESIZE_MAX_DIMENSION = 1200;
const RESIZE_QUALITY = 0.85;

function resizeImageFile(file, maxDimension = RESIZE_MAX_DIMENSION, quality = RESIZE_QUALITY) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { naturalWidth: width, naturalHeight: height } = img;

      if (Math.max(width, height) <= maxDimension) {
        resolve(file);
        return;
      }

      const scale = maxDimension / Math.max(width, height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const newName = file.name.replace(/\.[^./]+$/, '') + '.webp';
          resolve(new File([blob], newName, { type: blob.type, lastModified: Date.now() }));
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}

class MediaManager {
  constructor(userId = 'default-user') {
    this.userId = 'default-user'; // Always use default-user for consistency
    this.basePath = 'public/media'; // Use public path for easy access
  }

  getCurrentUserId() {
    return 'default-user'; // Always return default-user for consistency
  }

  setUserId(userId) {
    // Keep using default-user regardless of input
    this.userId = 'default-user';
    this.basePath = 'public/media';
  }

  async uploadFile(file, category = 'general') {
    try {
    
      
      // Always use public folder for consistency and easier access
      const uploadPath = `public/media/${category}`;

      const validation = this.validateFile(file);
      if (!validation.valid) {
        console.error('❌ File validation failed:', validation.error);
        return { success: false, error: validation.error };
      }

      const resizedFile = await resizeImageFile(file);

      const timestamp = Date.now();
      const fileName = `${timestamp}-${resizedFile.name}`;
      const fileRef = ref(storage, `${uploadPath}/${fileName}`);

      await uploadBytes(fileRef, resizedFile);
      const downloadURL = await getDownloadURL(fileRef);

      return {
        success: true,
        file: {
          name: fileName,
          originalName: file.name,
          url: downloadURL,
          path: fileRef.fullPath,
          category: category,
          size: resizedFile.size,
          type: resizedFile.type
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

  validateFile(file, maxSize = null) {
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

    // Determine max size based on file type if not explicitly provided
    if (maxSize === null) {
      maxSize = 50 * 1024 * 1024; // 50MB for all files
    }

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
