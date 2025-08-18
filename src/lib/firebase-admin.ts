
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;

if (!getApps().length) {
  try {
    if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
    
    app = initializeApp({
      credential: cert(serviceAccount)
    });
    
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error:", error.message);
    // If initialization fails, we should not proceed to get Firestore or Auth.
    // Instead, we let the app object be undefined, and functions using it should handle this case.
  }
} else {
    app = getApps()[0];
}

const adminDb: Firestore = getFirestore(app);
const adminAuth: Auth = getAuth(app);

export { adminDb, adminAuth };
