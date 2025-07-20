// Firebase Firestore utility functions
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './config';

// Collection names
export const COLLECTIONS = {
  INTRO: 'intro',
  CAPABILITIES: 'capabilities',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  EDUCATION: 'education',
  EXPERIENCE: 'experience'
};

// Get all documents from a collection
export const getCollectionData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

// Set/update a document in a collection
export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data, { merge: true });
    console.log(`Document ${docId} updated in ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return false;
  }
};

// Delete a document from a collection
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log(`Document ${docId} deleted from ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    return false;
  }
};

// Listen to real-time updates for a collection
export const subscribeToCollection = (collectionName, callback) => {
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    callback(data);
  }, (error) => {
    console.error(`Error listening to ${collectionName}:`, error);
  });
};

// Migrate JSON data to Firestore
export const migrateDataToFirestore = async (sectionsData) => {
  try {
    for (const section of sectionsData) {
      let collectionName;
      let docData;

      switch (section.type) {
        case 'intro':
          collectionName = COLLECTIONS.INTRO;
          docData = {
            name: section.name,
            title: section.title,
            type: section.type,
            content: section.content,
            data: section.data,
            updatedAt: new Date()
          };
          break;

        case 'capabilities':
          collectionName = COLLECTIONS.CAPABILITIES;
          docData = {
            title: section.title,
            type: section.type,
            content: section.content,
            updatedAt: new Date()
          };
          break;

        case 'skills':
          collectionName = COLLECTIONS.SKILLS;
          docData = {
            title: section.title,
            type: section.type,
            content: section.content,
            data: section.data,
            updatedAt: new Date()
          };
          break;

        case 'projects':
          collectionName = COLLECTIONS.PROJECTS;
          docData = {
            title: section.title,
            type: section.type,
            content: section.content,
            data: section.data,
            updatedAt: new Date()
          };
          break;

        case 'education':
          collectionName = COLLECTIONS.EDUCATION;
          docData = {
            title: section.title,
            type: section.type,
            content: section.content,
            data: section.data,
            updatedAt: new Date()
          };
          break;

        case 'experience':
          collectionName = COLLECTIONS.EXPERIENCE;
          docData = {
            title: section.title,
            type: section.type,
            experience: section.experience,
            updatedAt: new Date()
          };
          break;

        default:
          console.warn(`Unknown section type: ${section.type}`);
          continue;
      }

      await setDocument(collectionName, section.id, docData);
    }

    console.log('Data migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Error during data migration:', error);
    return false;
  }
};