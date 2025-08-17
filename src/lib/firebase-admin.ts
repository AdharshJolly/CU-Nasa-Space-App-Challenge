
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminDb: Firestore;
let adminAuth: Auth;

if (!getApps().length) {
  try {
    if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
    
    initializeApp({
      credential: cert(serviceAccount)
    });
    
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error:", error.message);
  }
}

adminDb = getFirestore();
adminAuth = getAuth();

export { adminDb, adminAuth };
