// Enhanced Migration Tool for JSON to Firebase with Dynamic Structure
import { setDoc, doc, collection, getDocs, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const uploadJsonToFirebase = async (onProgress = null) => {
  try {
    console.log('🚀 Starting JSON to Firebase migration...');
    onProgress?.({ step: 'Loading JSON data...', progress: 10 });
    
    // Fetch the JSON data
    const response = await fetch('/data/sectionsData.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.status}`);
    }
    const jsonData = await response.json();
    
    console.log('📄 JSON data loaded:', jsonData);
    onProgress?.({ step: 'JSON data loaded successfully', progress: 20 });
    
    // Clear existing Firestore data first (optional)
    onProgress?.({ step: 'Clearing existing data...', progress: 30 });
    await clearExistingData();
    
    // Process each section with enhanced structure
    const totalSections = jsonData.length;
    let completedSections = 0;
    
    for (const section of jsonData) {
      const { id, type, ...sectionData } = section;
      
      // Create structured document for Firestore
      const firestoreDoc = {
        ...sectionData,
        id: id,
        type: type || id,
        slug: generateSlug(sectionData.title || sectionData.name || id),
        isActive: true,
        order: getDefaultOrder(type || id),
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: '1.0.0',
          source: 'json-migration'
        }
      };
      
      // Use 'sections' as the main collection
      const docRef = doc(db, 'sections', id);
      await setDoc(docRef, firestoreDoc);
      
      completedSections++;
      const progress = 30 + (completedSections / totalSections) * 60;
      onProgress?.({ 
        step: `Migrated ${id} section (${completedSections}/${totalSections})`, 
        progress 
      });
      
      console.log(`✅ Migrated section: ${id}`);
    }
    
    // Create additional collections for better organization
    onProgress?.({ step: 'Setting up collections...', progress: 90 });
    await setupAdditionalCollections();
    
    onProgress?.({ step: 'Migration completed successfully!', progress: 100 });
    console.log('🎉 Migration completed successfully!');
    
    return { 
      success: true, 
      message: `Successfully migrated ${totalSections} sections to Firebase`,
      sectionsCount: totalSections
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    onProgress?.({ step: `Migration failed: ${error.message}`, progress: 0, error: true });
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Helper function to clear existing data
const clearExistingData = async () => {
  try {
    const sectionsRef = collection(db, 'sections');
    const snapshot = await getDocs(sectionsRef);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('🧹 Cleared existing sections');
  } catch (error) {
    console.warn('Warning: Could not clear existing data:', error);
  }
};

// Generate SEO-friendly slugs
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Get default order for sections
const getDefaultOrder = (type) => {
  const orderMap = {
    'intro': 1,
    'capabilities': 2,
    'skills': 3,
    'projects': 4,
    'education': 5,
    'experience': 6
  };
  return orderMap[type] || 999;
};

// Setup additional collections for better data organization
const setupAdditionalCollections = async () => {
  try {
    // Create site settings
    const siteSettingsRef = doc(db, 'settings', 'site');
    await setDoc(siteSettingsRef, {
      siteName: 'Ahmad Al-Qattu Portfolio',
      siteDescription: 'Software Developer Portfolio',
      theme: 'default',
      isMaintenanceMode: false,
      lastUpdated: new Date(),
      version: '1.0.0'
    });
    
    // Create user preferences
    const userPrefsRef = doc(db, 'settings', 'user');
    await setDoc(userPrefsRef, {
      defaultSlug: 'ahmad-alqattu',
      enableSlugCustomization: true,
      enableSectionReordering: true,
      enableThemeCustomization: true,
      lastModified: new Date()
    });
    
    console.log('✅ Additional collections setup complete');
  } catch (error) {
    console.warn('Warning: Could not setup additional collections:', error);
  }
};

// Function to get user's custom slug
export const getUserSlug = async () => {
  try {
    const userPrefsRef = doc(db, 'settings', 'user');
    const docSnap = await getDoc(userPrefsRef);
    
    if (docSnap.exists()) {
      return docSnap.data().defaultSlug || 'ahmad-alqattu';
    }
    return 'ahmad-alqattu';
  } catch (error) {
    console.error('Error getting user slug:', error);
    return 'ahmad-alqattu';
  }
};

// Function to update user's slug
export const updateUserSlug = async (newSlug) => {
  try {
    const userPrefsRef = doc(db, 'settings', 'user');
    await setDoc(userPrefsRef, {
      defaultSlug: generateSlug(newSlug),
      lastModified: new Date()
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user slug:', error);
    return { success: false, error: error.message };
  }
};
