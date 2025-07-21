import { auth } from '../firebase/config';
import { getAllSections } from '../firebase/firestore';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const debugFirebaseStructure = async () => {
  console.log('🔍 DEBUGGING FIREBASE STRUCTURE...');
  console.log('=====================================');
  
  try {
    // Check the users collection
    console.log('\n📂 Checking users collection...');
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    console.log('👥 Found', usersSnapshot.size, 'user documents');
    
    // Check default-user document
    console.log('\n📄 Checking default-user document...');
    const defaultUserRef = doc(db, 'users', 'default-user');
    const defaultUserDoc = await getDoc(defaultUserRef);
    
    if (defaultUserDoc.exists()) {
      console.log('✅ default-user document exists');
      console.log('📋 Data:', defaultUserDoc.data());
    } else {
      console.log('❌ default-user document does not exist');
    }
    
    // Check default-user sections collection
    console.log('\n📁 Checking default-user/sections collection...');
    const sectionsRef = collection(db, 'users', 'default-user', 'sections');
    const sectionsSnapshot = await getDocs(sectionsRef);
    console.log('📄 Found', sectionsSnapshot.size, 'section documents');
    
    sectionsSnapshot.forEach((doc) => {
      console.log(`  - Document ID: ${doc.id}`);
      console.log(`    Data:`, doc.data());
      console.log('    ---');
    });
    
    // Test getAllSections function directly
    console.log('\n🔧 Testing getAllSections function...');
    const sections = await getAllSections('default-user');
    console.log('📊 getAllSections returned:', sections.length, 'sections');
    sections.forEach((section, i) => {
      console.log(`  ${i+1}. ID: ${section.id}, Type: ${section.type || 'unknown'}, Order: ${section.order}`);
    });
    
  } catch (error) {
    console.error('❌ Error debugging Firebase structure:', error);
  }
};

// Make available in console
if (typeof window !== 'undefined') {
  window.debugFirebaseStructure = debugFirebaseStructure;
}
