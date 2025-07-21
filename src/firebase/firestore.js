import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from './config';

// User-specific collection structure
const getUserSectionsCollection = (userId = 'default-user') => `users/${userId}/sections`;

// Get all sections from Firestore for specific user
export const getAllSections = async (userId = 'default-user') => {
  try {
    console.log('🔍 getAllSections called for userId:', userId);
    const collectionPath = getUserSectionsCollection(userId);
    console.log('📂 Collection path:', collectionPath);
    
    const sectionsRef = collection(db, collectionPath);
    
    // First try without orderBy to see if we can get any documents
    console.log('📊 Querying sections without orderBy...');
    let snapshot = await getDocs(sectionsRef);
    console.log('📄 Raw documents found:', snapshot.size);
    
    const sections = [];
    snapshot.forEach((doc) => {
      console.log(`  - Document: ${doc.id}`, doc.data());
      sections.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Now try to sort by order if the field exists
    const sectionsWithOrder = sections.filter(s => s.order !== undefined);
    if (sectionsWithOrder.length > 0) {
      console.log('✅ Some sections have order field, sorting...');
      sections.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
      console.log('⚠️ No sections have order field, returning unsorted');
    }
    
    console.log('📋 Final sections:', sections.length);
    return sections;
  } catch (error) {
    console.error('❌ Error fetching sections:', error);
    throw error;
  }
};

// Subscribe to real-time section updates for specific user
export const subscribeToSections = (callback, userId = 'default-user') => {
  try {
    const sectionsRef = collection(db, getUserSectionsCollection(userId));
    const q = query(sectionsRef, orderBy('order', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const sections = [];
      snapshot.forEach((doc) => {
        sections.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(sections);
    }, (error) => {
      console.error('Error in sections subscription:', error);
      callback(null, error);
    });
  } catch (error) {
    console.error('Error setting up sections subscription:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Get a specific section by ID for specific user
export const getSection = async (sectionId, userId = 'default-user') => {
  try {
    const sectionRef = doc(db, getUserSectionsCollection(userId), sectionId);
    const sectionSnap = await getDoc(sectionRef);
    
    if (sectionSnap.exists()) {
      return {
        id: sectionSnap.id,
        ...sectionSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching section:', error);
    throw error;
  }
};

// Update a section for specific user (creates if doesn't exist)
export const updateSection = async (sectionId, sectionData, userId = 'default-user') => {
  try {
    const sectionRef = doc(db, getUserSectionsCollection(userId), sectionId);
    
    const updateData = {
      ...sectionData,
      lastUpdated: new Date().toISOString(),
      userId: userId
    };
    
    // Use setDoc instead of updateDoc to create if doesn't exist
    await setDoc(sectionRef, updateData, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating section:', error);
    return { success: false, error: error.message };
  }
};

// Create a new section
export const createSection = async (sectionData) => {
  try {
    const sectionRef = doc(collection(db, SECTIONS_COLLECTION));
    
    const newSectionData = {
      ...sectionData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    await setDoc(sectionRef, newSectionData);
    
    return { success: true, id: sectionRef.id };
  } catch (error) {
    console.error('Error creating section:', error);
    return { success: false, error: error.message };
  }
};

// Delete a section
export const deleteSection = async (sectionId) => {
  try {
    const sectionRef = doc(db, SECTIONS_COLLECTION, sectionId);
    await deleteDoc(sectionRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting section:', error);
    return { success: false, error: error.message };
  }
};

// Upload section data (used by migration tool)
export const uploadSectionData = async (sectionId, sectionData) => {
  try {
    const sectionRef = doc(db, SECTIONS_COLLECTION, sectionId);
    
    const uploadData = {
      ...sectionData,
      uploadedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    await setDoc(sectionRef, uploadData);
    
    return { success: true };
  } catch (error) {
    console.error('Error uploading section data:', error);
    return { success: false, error: error.message };
  }
};

// Get sections count for dashboard stats
export const getSectionsCount = async () => {
  try {
    const sectionsRef = collection(db, SECTIONS_COLLECTION);
    const snapshot = await getDocs(sectionsRef);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting sections count:', error);
    return 0;
  }
};

// Check if Firebase is properly connected
export const checkFirebaseConnection = async () => {
  try {
    // Try to read from a test document
    const testRef = doc(db, 'test', 'connection');
    await getDoc(testRef);
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
};

// Legacy functions for backward compatibility
export const getIntroData = async () => {
  return await getSection('intro');
};

export const getSkillsData = async () => {
  return await getSection('skills');
};

export const getProjectsData = async () => {
  return await getSection('projects');
};

export const getCapabilitiesData = async () => {
  return await getSection('capabilities');
};

export const updateIntroData = async (data) => {
  return await updateSection('intro', data);
};

export const updateSkillsData = async (data) => {
  return await updateSection('skills', data);
};

export const updateProjectsData = async (data) => {
  return await updateSection('projects', data);
};

export const updateCapabilitiesData = async (data) => {
  return await updateSection('capabilities', data);
};
