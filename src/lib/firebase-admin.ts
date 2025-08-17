
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;

if (getApps().length === 0) {
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
    // In case of error, we should not proceed, but we'll set them to null 
    // to avoid crashes on import for modules that might not use them.
    // The modules that do use them will need to handle the possibility of them being undefined.
    app = null as any; 
  }
} else {
  app = getApps()[0];
}

adminDb = getFirestore(app);
adminAuth = getAuth(app);


export { adminDb, adminAuth };
