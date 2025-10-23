import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import app from './config';

let analytics = null;

// Initialize analytics only if supported (not in localhost)
const initializeAnalytics = async () => {
  const supported = await isSupported();
  if (supported) {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
  } else {
    console.log('Firebase Analytics not supported in this environment');
  }
};

// Initialize analytics
initializeAnalytics();

// Helper function to log custom events
export const logCustomEvent = (eventName, eventParams = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export { analytics };
