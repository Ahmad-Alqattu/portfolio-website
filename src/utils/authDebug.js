import { auth } from '../firebase/config.js';
import { getAllSections } from '../firebase/firestore.js';

// Debug authentication and data loading
export const debugAuth = () => {
  console.log('🔍 Debugging authentication and data...');
  
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log('✅ User authenticated:');
      console.log('  - UID:', user.uid);
      console.log('  - Email:', user.email);
      
      try {
        const sections = await getAllSections(user.uid);
        console.log('📄 Sections found:', sections.length);
        sections.forEach((section, index) => {
          console.log(`  ${index + 1}. ${section.type || section.id} - Order: ${section.order}`);
        });
      } catch (error) {
        console.error('❌ Error loading sections:', error);
      }
    } else {
      console.log('❌ No user authenticated');
      console.log('💡 Try logging in first');
    }
  });
};

// Make it available in browser console
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
}
