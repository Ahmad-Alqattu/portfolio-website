// User configuration and slug management with user-oriented database
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';
import { useAuth } from '../contexts/AuthContext';

export class UserConfigManager {
  constructor() {
    this.configCollection = 'userConfigs';
  }

  // Get current user ID (for user-oriented database)
  getCurrentUserId() {
    // In future, this will be the actual user ID from authentication
    // For now, using a default user ID
    return 'default-user'; 
  }

  // Get user configuration
  async getConfig() {
    try {
      const userId = this.getCurrentUserId();
      const configDoc = await getDoc(doc(db, this.configCollection, userId));
      
      if (configDoc.exists()) {
        return configDoc.data();
      } else {
        // Create default config for new user
        const defaultConfig = this.getDefaultConfig();
        await this.saveConfig(defaultConfig);
        return defaultConfig;
      }
    } catch (error) {
      console.error('Error fetching user config:', error);
      return this.getDefaultConfig();
    }
  }

  // Save user configuration
  async saveConfig(config) {
    try {
      const userId = this.getCurrentUserId();
      const configWithMeta = {
        ...config,
        userId: userId,
        lastUpdated: new Date().toISOString(),
        version: '2.0'
      };
      
      await setDoc(doc(db, this.configCollection, userId), configWithMeta);
      return { success: true };
    } catch (error) {
      console.error('Error saving user config:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user's custom slug with availability check
  async updateSlug(newSlug) {
    try {
      // Validate slug format
      const validation = this.validateSlug(newSlug);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Check if slug is available
      const isAvailable = await this.isSlugAvailable(newSlug);
      if (!isAvailable) {
        return { success: false, error: 'This slug is already taken by another user' };
      }

      const currentConfig = await this.getConfig();
      const updatedConfig = {
        ...currentConfig,
        customSlug: newSlug,
        slugHistory: [
          ...(currentConfig.slugHistory || []),
          {
            slug: newSlug,
            createdAt: new Date().toISOString(),
            userId: this.getCurrentUserId()
          }
        ].slice(-10) // Keep last 10 slugs
      };

      return await this.saveConfig(updatedConfig);
    } catch (error) {
      console.error('Error updating slug:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if slug is available across all users
  async isSlugAvailable(slug) {
    try {
      const currentUserId = this.getCurrentUserId();
      
      // Query all user configs to check for slug conflicts
      const configsRef = collection(db, this.configCollection);
      const q = query(configsRef, where('customSlug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      // Slug is available if no other user has it
      return querySnapshot.empty || 
             (querySnapshot.size === 1 && querySnapshot.docs[0].id === currentUserId);
    } catch (error) {
      console.error('Error checking slug availability:', error);
      return false; // Assume not available on error for safety
    }
  }

  // Validate slug format
  validateSlug(slug) {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    
    if (!slug || slug.trim() === '') {
      return { valid: false, error: 'Slug cannot be empty' };
    }

    if (slug.length < 3) {
      return { valid: false, error: 'Slug must be at least 3 characters long' };
    }

    if (slug.length > 50) {
      return { valid: false, error: 'Slug must be less than 50 characters' };
    }

    if (!slugRegex.test(slug)) {
      return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
    }

    if (slug.startsWith('-') || slug.endsWith('-')) {
      return { valid: false, error: 'Slug cannot start or end with a hyphen' };
    }

    // Reserved slugs
    const reservedSlugs = ['admin', 'api', 'www', 'app', 'mail', 'ftp', 'login', 'register'];
    if (reservedSlugs.includes(slug)) {
      return { valid: false, error: 'This slug is reserved and cannot be used' };
    }

    return { valid: true };
  }

  // Generate a slug from name with uniqueness
  async generateUniqueSlugFromName(name) {
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

    let slug = baseSlug;
    let counter = 1;

    // Keep trying until we find an available slug
    while (!(await this.isSlugAvailable(slug))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  // Get default configuration
  getDefaultConfig() {
    return {
      customSlug: 'my-portfolio',
      personalInfo: {
        name: '',
        email: '',
        title: '',
        bio: ''
      },
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        darkMode: false,
        layout: 'modern'
      },
      seo: {
        title: 'My Portfolio',
        description: 'Professional portfolio showcasing my work and skills',
        keywords: ['portfolio', 'developer', 'designer'],
        ogImage: ''
      },
      social: {
        linkedin: '',
        github: '',
        twitter: '',
        email: '',
        website: ''
      },
      features: {
        enableComments: false,
        enableAnalytics: false,
        enableContactForm: true,
        showVisitorCounter: false,
        enableDownloadCV: true
      },
      privacy: {
        showEmail: true,
        showPhone: false,
        allowIndexing: true
      },
      sections: {
        order: ['intro', 'skills', 'projects', 'experience', 'education', 'capabilities'],
        visibility: {
          intro: true,
          skills: true,
          projects: true,
          experience: true,
          education: true,
          capabilities: true
        }
      },
      slugHistory: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      version: '2.0'
    };
  }

  // Get portfolio URL with custom slug
  getPortfolioUrl(customSlug) {
    const baseUrl = window.location.origin;
    return customSlug && customSlug !== 'my-portfolio' ? 
           `${baseUrl}/${customSlug}` : baseUrl;
  }

  // Get all available slugs (for admin purposes)
  async getAllSlugs() {
    try {
      const configsRef = collection(db, this.configCollection);
      const querySnapshot = await getDocs(configsRef);
      
      const slugs = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.customSlug) {
          slugs.push({
            slug: data.customSlug,
            userId: doc.id,
            createdAt: data.createdAt,
            userName: data.personalInfo?.name || 'Unknown'
          });
        }
      });
      
      return slugs;
    } catch (error) {
      console.error('Error fetching all slugs:', error);
      return [];
    }
  }

  // Update section visibility
  async updateSectionVisibility(sectionType, isVisible) {
    try {
      const currentConfig = await this.getConfig();
      const updatedConfig = {
        ...currentConfig,
        sections: {
          ...currentConfig.sections,
          visibility: {
            ...currentConfig.sections.visibility,
            [sectionType]: isVisible
          }
        }
      };

      return await this.saveConfig(updatedConfig);
    } catch (error) {
      console.error('Error updating section visibility:', error);
      return { success: false, error: error.message };
    }
  }

  // Update section order
  async updateSectionOrder(newOrder) {
    try {
      const currentConfig = await this.getConfig();
      const updatedConfig = {
        ...currentConfig,
        sections: {
          ...currentConfig.sections,
          order: newOrder
        }
      };

      return await this.saveConfig(updatedConfig);
    } catch (error) {
      console.error('Error updating section order:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export a singleton instance
export const userConfigManager = new UserConfigManager();

// Helper functions for components
export const getUserConfig = async () => {
  return await userConfigManager.getConfig();
};

export const saveUserConfig = async (config) => {
  return await userConfigManager.saveConfig(config);
};

export const updateUserSlug = async (slug) => {
  return await userConfigManager.updateSlug(slug);
};

export const validateSlug = (slug) => {
  return userConfigManager.validateSlug(slug);
};

export const generateSlug = (name) => {
  return userConfigManager.generateSlugFromName(name);
};
