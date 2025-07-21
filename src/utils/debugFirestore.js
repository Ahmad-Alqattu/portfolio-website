// Debug utilities for testing Firebase
import { auth } from '../firebase/config';
import { getAllSections, updateSection } from '../firebase/firestore';

export const debugFirestore = async () => {
  console.log('🔍 Debug Firestore Connection');
  
  // Check auth state
  console.log('Auth state:', auth.currentUser ? 'Authenticated' : 'Not authenticated');
  if (auth.currentUser) {
    console.log('User:', auth.currentUser.email);
  }
  
  try {
    // Try to get sections
    console.log('Fetching sections...');
    const sections = await getAllSections();
    console.log('Sections found:', sections.length);
    sections.forEach(s => console.log('- Section:', s.id, s.type, s.title));
    
    return { success: true, sections };
  } catch (error) {
    console.error('Firestore error:', error);
    return { success: false, error: error.message };
  }
};

export const testFirestoreWrite = async () => {
  if (!auth.currentUser) {
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    console.log('Testing Firestore write...');
    const testSection = {
      id: 'test',
      type: 'test',
      title: 'Test Section',
      content: 'This is a test section',
      data: { test: true },
      order: 999
    };
    
    const result = await updateSection('test', testSection);
    console.log('Write test result:', result);
    
    return result;
  } catch (error) {
    console.error('Write test error:', error);
    return { success: false, error: error.message };
  }
};

// Expose to window for console testing
window.debugFirestore = debugFirestore;
window.testFirestoreWrite = testFirestoreWrite;
