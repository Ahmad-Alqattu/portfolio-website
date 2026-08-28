// Firebase Backup Script
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWwIVj2PsAa2EWbkjXSO3znIKSwq0sdUM",
  authDomain: "portfolio-8b0ca.firebaseapp.com",
  projectId: "portfolio-8b0ca",
  storageBucket: "portfolio-8b0ca.firebasestorage.app",
  messagingSenderId: "389810433083",
  appId: "1:389810433083:web:362c9d46cac456d607801e",
  measurementId: "G-N927FLEPJ6"
};

async function backupFirestore() {
  try {
    console.log('🔄 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('📥 Fetching data from Firestore...');
    const sectionsRef = collection(db, 'users', 'default-user', 'sections');
    const snapshot = await getDocs(sectionsRef);

    const sections = [];
    snapshot.forEach((doc) => {
      sections.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by order
    sections.sort((a, b) => (a.order || 999) - (b.order || 999));

    // Create backups directory if it doesn't exist
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Save with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `firebase-backup-${timestamp}.json`);

    fs.writeFileSync(backupFile, JSON.stringify(sections, null, 2));

    console.log(`✅ Backup saved successfully!`);
    console.log(`📁 Location: ${backupFile}`);
    console.log(`📊 Total sections: ${sections.length}`);

    // Also save as latest backup
    const latestFile = path.join(backupDir, 'firebase-backup-latest.json');
    fs.writeFileSync(latestFile, JSON.stringify(sections, null, 2));
    console.log(`✅ Latest backup updated: ${latestFile}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

backupFirestore();
