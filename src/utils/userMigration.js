// User-specific migration utility
import { auth } from '../firebase/config';
import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where,
  writeBatch
} from 'firebase/firestore';

// Get sections data from public/data/sectionsData.json
const loadJsonData = async () => {
  try {
    const response = await fetch('/data/sectionsData.json');
    if (!response.ok) {
      throw new Error('Failed to load JSON data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading JSON data:', error);
    throw error;
  }
};

// Convert flat JSON structure to user-specific structure
const prepareUserData = (jsonData, userId) => {
  const sections = [];
  
  // Handle different section types from JSON
  Object.entries(jsonData).forEach(([key, value]) => {
    if (key === 'intro') {
      sections.push({
        id: 'intro',
        type: 'intro',
        title: value.name || 'Introduction',
        content: value.description || '',
        data: value,
        order: 1,
        visible: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else if (key === 'skills') {
      sections.push({
        id: 'skills',
        type: 'skills',
        title: 'Skills',
        content: value.content || '',
        data: value,
        order: 2,
        visible: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else if (key === 'projects') {
      sections.push({
        id: 'projects',
        type: 'projects',
        title: 'Projects',
        content: value.content || '',
        data: value,
        order: 3,
        visible: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else if (key === 'education') {
      sections.push({
        id: 'education',
        type: 'education',
        title: 'Education',
        content: value.content || '',
        data: value,
        order: 4,
        visible: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else if (key === 'experience') {
      sections.push({
        id: 'experience',
        type: 'experience',
        title: 'Experience',
        content: value.content || '',
        experience: value,
        order: 5,
        visible: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else if (key === 'capabilities') {
      sections.push({
        id: 'capabilities',
        type: 'capabilities',
        title: 'Capabilities',
        content: value.content || '',
        data: value,
        order: 6,
        visible: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  });
  
  return sections;
};

// Upload JSON data to user-specific Firebase collections
export const uploadJsonToFirebase = async () => {
  try {
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { 
        success: false, 
        error: 'User must be authenticated to upload data' 
      };
    }

    const userId = currentUser.uid;
    
    // Load JSON data
    const jsonData = await loadJsonData();
    
    // Check if user already has data
    const userSectionsCollection = collection(db, `users/${userId}/sections`);
    const existingData = await getDocs(userSectionsCollection);
    
    if (!existingData.empty) {
      const overwrite = window.confirm(
        'You already have data in Firebase. Do you want to overwrite it with JSON data?'
      );
      if (!overwrite) {
        return { success: false, error: 'Migration cancelled by user' };
      }
    }
    
    // Prepare user-specific sections
    const sections = prepareUserData(jsonData, userId);
    
    // Use batch write for atomic operation
    const batch = writeBatch(db);
    
    sections.forEach(section => {
      const sectionRef = doc(db, `users/${userId}/sections`, section.id);
      batch.set(sectionRef, section);
    });
    
    // Create user config document
    const userConfigRef = doc(db, 'users', userId);
    batch.set(userConfigRef, {
      email: currentUser.email,
      customSlug: `${currentUser.email.split('@')[0]}-portfolio`,
      theme: 'light',
      sectionsOrder: sections.map(s => s.id),
      migrationDate: new Date(),
      lastUpdated: new Date()
    }, { merge: true });
    
    // Commit the batch
    await batch.commit();
    
    return {
      success: true,
      message: `Successfully migrated ${sections.length} sections to Firebase`,
      sectionsCount: sections.length
    };
    
  } catch (error) {
    console.error('Error uploading JSON to Firebase:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred during migration'
    };
  }
};

// Check if user has any data in Firebase
export const checkUserData = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { hasData: false, error: 'User not authenticated' };
    }

    const userSectionsCollection = collection(db, `users/${currentUser.uid}/sections`);
    const snapshot = await getDocs(userSectionsCollection);
    
    return {
      hasData: !snapshot.empty,
      sectionsCount: snapshot.size,
      sections: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error('Error checking user data:', error);
    return { hasData: false, error: error.message };
  }
};

// Get migration status for current user
export const getMigrationStatus = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { status: 'no-auth' };
    }

    const userDataCheck = await checkUserData();
    
    if (userDataCheck.hasData) {
      return {
        status: 'has-data',
        sectionsCount: userDataCheck.sectionsCount,
        lastMigration: null // Can be enhanced to track migration date
      };
    } else {
      return { status: 'no-data' };
    }
  } catch (error) {
    console.error('Error getting migration status:', error);
    return { status: 'error', error: error.message };
  }
};
