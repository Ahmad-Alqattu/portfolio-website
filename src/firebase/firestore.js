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
    const collectionPath = getUserSectionsCollection(userId);
    
    const sectionsRef = collection(db, collectionPath);
    
    // Query sections
    let snapshot = await getDocs(sectionsRef);
    
    const sections = [];
    snapshot.forEach((doc) => {
      sections.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by order if the field exists
    const sectionsWithOrder = sections.filter(s => s.order !== undefined);
    if (sectionsWithOrder.length > 0) {
      sections.sort((a, b) => (a.order || 999) - (b.order || 999));
    }
    
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
    // Don't use orderBy in query as it requires all docs to have the field
    // We'll sort manually in the callback instead
    
    return onSnapshot(sectionsRef, (snapshot) => {
      const sections = [];
      snapshot.forEach((doc) => {
        sections.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by order manually to handle missing order fields
      sections.sort((a, b) => (a.order || 999) - (b.order || 999));
      
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
