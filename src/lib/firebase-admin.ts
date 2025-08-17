
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let adminAuth: Auth | undefined;

let initializationError: Error | null = null;
let isInitialized = false;

function initializeAdmin() {
  if (isInitialized) {
    return;
  }
  
  if (getApps().some(app => app.name === 'admin')) {
    const existingApp = getApps().find(app => app.name === 'admin');
    if (existingApp) {
        adminApp = existingApp;
    }
  } else {
    try {
      if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
        throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
      }
      
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
      
      adminApp = initializeApp({
          credential: cert(serviceAccount)
      }, 'admin');
    } catch (error: any) {
        console.error('Firebase Admin SDK initialization error:', error.message);
        initializationError = error;
        adminApp = undefined; // Ensure app is undefined on error
    }
  }
  
  if (adminApp) {
    adminDb = getFirestore(adminApp);
    adminAuth = getAuth(adminApp);
    isInitialized = true;
    initializationError = null; // Clear error on success
  }
}

// Initialize on first import
initializeAdmin();

export { adminDb, adminAuth, initializeAdmin, isInitialized };
