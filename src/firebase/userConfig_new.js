// User Configuration and Public Portfolio System - MVP
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export const getUserConfig = async (userId = null) => {
  try {
    const user = userId || getCurrentUserId();
    if (!user) return null;
    
    const configRef = doc(db, 'users', user, 'config', 'profile');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      return configSnap.data();
    } else {
      // Create default config
      const defaultConfig = {
        userSlug: user.substring(0, 8), // Default slug from user ID
        portfolioTitle: 'My Portfolio',
        theme: 'modern',
        isPublic: false,
        customDomain: '',
        seo: {
          title: 'Portfolio',
          description: 'My professional portfolio',
          keywords: []
        },
        socialLinks: {
          linkedin: '',
          github: '',
          twitter: '',
          email: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(configRef, defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    console.error('Error getting user config:', error);
    return null;
  }
};

export const updateUserConfig = async (updates, userId = null) => {
  try {
    const user = userId || getCurrentUserId();
    if (!user) throw new Error('No user authenticated');
    
    const configRef = doc(db, 'users', user, 'config', 'profile');
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(configRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating user config:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserSlug = async (newSlug, userId = null) => {
  try {
    const user = userId || getCurrentUserId();
    if (!user) throw new Error('No user authenticated');
    
    // Check if slug is available
    const isAvailable = await checkSlugAvailability(newSlug, user);
    if (!isAvailable) {
      throw new Error('This username is already taken');
    }
    
    // Update user config with new slug
    const result = await updateUserConfig({ userSlug: newSlug }, user);
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return { success: true, slug: newSlug };
  } catch (error) {
    console.error('Error updating user slug:', error);
    return { success: false, error: error.message };
  }
};

export const checkSlugAvailability = async (slug, currentUserId = null) => {
  try {
    // Simple availability check - in a real app you'd have a proper slug registry
    const slugPattern = /^[a-zA-Z0-9-_]{3,20}$/;
    if (!slugPattern.test(slug)) {
      return false; // Invalid format
    }
    
    // Reserved slugs
    const reservedSlugs = ['admin', 'api', 'www', 'app', 'dashboard', 'login', 'signup', 'help', 'support'];
    if (reservedSlugs.includes(slug.toLowerCase())) {
      return false;
    }
    
    // For MVP, we'll assume all non-reserved slugs are available
    // In production, you'd check against a slugs collection
    return true;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }
};

export const getPublicPortfolio = async (userSlug) => {
  try {
    // Find user by slug (in production you'd have a slugs index)
    // For MVP, we'll implement a basic lookup
    const portfolioData = await getPortfolioBySlug(userSlug);
    return portfolioData;
  } catch (error) {
    console.error('Error getting public portfolio:', error);
    return null;
  }
};

export const getPortfolioBySlug = async (slug) => {
  try {
    // This is a simplified implementation for MVP
    // In production, you'd have proper slug-to-user mapping
    
    // For now, we'll try to find the user config that matches this slug
    // This would be optimized with proper indexing in production
    
    return {
      found: false,
      message: 'Portfolio lookup by slug - Implementation needed for production'
    };
  } catch (error) {
    console.error('Error getting portfolio by slug:', error);
    return null;
  }
};

export const publishPortfolio = async (userId = null) => {
  try {
    const user = userId || getCurrentUserId();
    if (!user) throw new Error('No user authenticated');
    
    const result = await updateUserConfig({ 
      isPublic: true,
      publishedAt: new Date().toISOString()
    }, user);
    
    return result;
  } catch (error) {
    console.error('Error publishing portfolio:', error);
    return { success: false, error: error.message };
  }
};

export const unpublishPortfolio = async (userId = null) => {
  try {
    const user = userId || getCurrentUserId();
    if (!user) throw new Error('No user authenticated');
    
    const result = await updateUserConfig({ 
      isPublic: false,
      unpublishedAt: new Date().toISOString()
    }, user);
    
    return result;
  } catch (error) {
    console.error('Error unpublishing portfolio:', error);
    return { success: false, error: error.message };
  }
};

export const getPortfolioStats = async (userId = null) => {
  try {
    const user = userId || getCurrentUserId();
    if (!user) throw new Error('No user authenticated');
    
    // Get basic stats (would be enhanced with analytics in production)
    const config = await getUserConfig(user);
    
    return {
      isPublic: config?.isPublic || false,
      userSlug: config?.userSlug || '',
      portfolioUrl: config?.userSlug ? `${window.location.origin}/${config.userSlug}` : '',
      createdAt: config?.createdAt,
      updatedAt: config?.updatedAt,
      publishedAt: config?.publishedAt,
      // Mock stats for MVP
      views: 0,
      uniqueVisitors: 0,
      lastViewed: null
    };
  } catch (error) {
    console.error('Error getting portfolio stats:', error);
    return null;
  }
};

// Helper function to get current user ID
const getCurrentUserId = () => {
  // This would integrate with your auth system
  // For now, returning null to be handled by calling functions
  return null;
};
