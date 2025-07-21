// Migration script to transfer JSON data to Firestore
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const migrateJsonToFirestore = async () => {
  try {
    console.log('Starting migration from JSON to Firestore...');
    
    // Fetch the JSON data
    const response = await fetch('/data/sectionsData.json');
    const jsonData = await response.json();
    
    console.log('JSON data loaded:', jsonData);
    
    // Migrate each section to its respective collection
    for (const section of jsonData) {
      const { id, type, ...sectionData } = section;
      
      // Use type or id to determine collection name
      const collectionName = type || id;
      
      try {
        // Create a document in Firestore
        await setDoc(doc(db, collectionName, id), {
          ...sectionData,
          type: type || id,
          id: id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Migrated ${id} to ${collectionName} collection`);
      } catch (error) {
        console.error(`❌ Failed to migrate ${id}:`, error);
      }
    }
    
    console.log('🎉 Migration completed!');
    return { success: true, message: 'Data migrated successfully' };
    
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to clear all Firestore data (use with caution!)
export const clearFirestoreData = async () => {
  console.warn('This will delete all Firestore data!');
  // Implementation would go here if needed
};
