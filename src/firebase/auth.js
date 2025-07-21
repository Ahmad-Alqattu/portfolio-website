// Firebase Authentication utilities
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';
import { createUserProfile } from './firestore';

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      displayName,
      username,
      email,
      createdAt: new Date().toISOString(),
      profilePicture: null,
      cvUrl: null
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user profile exists, if not create one
    try {
      await createUserProfile(user.uid, {
        displayName: user.displayName,
        username: user.email.split('@')[0], // Default username from email
        email: user.email,
        createdAt: new Date().toISOString(),
        profilePicture: user.photoURL,
        cvUrl: null
      });
    } catch (error) {
      // Profile might already exist, which is fine
      console.log('User profile may already exist:', error.message);
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to authentication state changes
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user is admin (simplified - you can implement role-based auth later)
export const isUserAdmin = (user) => {
  // For now, any authenticated user is considered admin
  // In production, you would check against a whitelist or role in Firestore
  return user !== null;
};