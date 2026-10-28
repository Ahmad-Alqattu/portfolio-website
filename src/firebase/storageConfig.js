// Split out from ./config so firebase/storage only loads for the
// admin-only screens that actually use it (StorageBrowser, UniversalEditor),
// not for every visitor to the public site.
import { getStorage } from 'firebase/storage';
import app from './config';

export const storage = getStorage(app);
