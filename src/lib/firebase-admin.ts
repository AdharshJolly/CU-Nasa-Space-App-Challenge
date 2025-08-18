
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!serviceAccountKey) {
    throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
}

const serviceAccount = JSON.parse(serviceAccountKey);

// Ensure there's only one app instance.
const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };
