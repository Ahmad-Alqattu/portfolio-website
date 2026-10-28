// Calls the publishSite Cloud Function (functions/index.js), which starts
// the GitHub Actions build that prerenders and deploys the site.
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './config';

export async function publishSite() {
  const call = httpsCallable(getFunctions(app, 'us-central1'), 'publishSite');
  const { data } = await call();
  return data;
}
