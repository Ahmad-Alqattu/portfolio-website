import { mediaManager } from '../firebase/mediaManager';

export const testFileUpload = async () => {
  console.log('🧪 TESTING FILE UPLOAD SYSTEM...');
  console.log('==================================');
  
  try {
    // Test 1: Check if mediaManager is properly initialized
    console.log('📋 MediaManager initialized with:');
    console.log('  - User ID:', mediaManager.userId);
    console.log('  - Base Path:', mediaManager.basePath);
    
    // Test 2: Create a fake file blob for testing
    console.log('\n🔬 Creating test file...');
    const testContent = 'This is a test file for upload testing';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test-upload.txt', { type: 'text/plain' });
    
    console.log('📄 Test file created:');
    console.log('  - Name:', testFile.name);
    console.log('  - Size:', testFile.size, 'bytes');
    console.log('  - Type:', testFile.type);
    
    // Test 3: Try to upload the test file
    console.log('\n⬆️ Testing upload...');
    const result = await mediaManager.uploadFile(testFile, 'test');
    
    console.log('📊 Upload result:', result);
    
    if (result.success) {
      console.log('✅ UPLOAD TEST PASSED!');
      console.log('📎 File URL:', result.file.url);
      return { success: true, url: result.file.url };
    } else {
      console.log('❌ UPLOAD TEST FAILED!');
      console.log('💥 Error:', result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('💥 TEST EXCEPTION:', error);
    return { success: false, error: error.message };
  }
};

// Test the individual components
export const testComponents = () => {
  console.log('🔧 TESTING COMPONENT INTEGRATION...');
  console.log('====================================');
  
  console.log('📋 Available components:');
  console.log('  - mediaManager:', typeof mediaManager);
  
  // Check if Firebase is properly initialized
  try {
    import('../firebase/config').then(config => {
      console.log('  - Firebase app:', !!config.app);
      console.log('  - Firebase storage:', !!config.storage);
      console.log('  - Firebase auth:', !!config.auth);
    });
  } catch (error) {
    console.error('❌ Firebase config error:', error);
  }
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  window.testFileUpload = testFileUpload;
  window.testComponents = testComponents;
}
