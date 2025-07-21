import { auth } from '../firebase/config';
import { getAllSections } from '../firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const investigateData = async () => {
  console.log('🔍 INVESTIGATING DATA ISSUE...');
  console.log('================================');
  
  // Check auth state
  const user = auth.currentUser;
  if (user) {
    console.log('✅ Current user:', user.uid, '-', user.email);
  } else {
    console.log('❌ No current user');
    return;
  }
  
  // Check what collections exist in users
  try {
    console.log('\n📂 Checking users collection...');
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    console.log('👥 Found', usersSnapshot.size, 'user documents');
    
    usersSnapshot.forEach((doc) => {
      console.log('  - User ID:', doc.id);
    });
    
    // Check current user's sections
    console.log('\n📄 Checking current user sections...');
    const userSections = await getAllSections(user.uid);
    console.log('📊 Sections for', user.uid, ':', userSections.length);
    
    if (userSections.length > 0) {
      userSections.forEach((section, i) => {
        console.log(`  ${i+1}. ${section.type || section.id} (order: ${section.order})`);
      });
    } else {
      console.log('  ⚠️ No sections found for current user');
    }
    
    // Check default-user sections (the old path)
    console.log('\n📄 Checking default-user sections...');
    const defaultSections = await getAllSections('default-user');
    console.log('📊 Sections for default-user:', defaultSections.length);
    
    if (defaultSections.length > 0) {
      defaultSections.forEach((section, i) => {
        console.log(`  ${i+1}. ${section.type || section.id} (order: ${section.order})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error investigating:', error);
  }
};

// Make available in console
if (typeof window !== 'undefined') {
  window.investigateData = investigateData;
}
