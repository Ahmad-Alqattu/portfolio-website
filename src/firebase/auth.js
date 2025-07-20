// Firebase Authentication utilities
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { auth } from './config';

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
    return { success: true, user: userCredential.user };
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