
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;

try {
    if (getApps().length === 0) {
        if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
            throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
        }
        
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
        
        app = initializeApp({
            credential: cert(serviceAccount)
        });
    } else {
        app = getApps()[0];
    }
    
    adminDb = getFirestore(app);
    adminAuth = getAuth(app);

} catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Depending on your error handling strategy, you might want to rethrow the error
    // or handle it gracefully. For now, we log it and the exported values will be undefined.
}

export { adminDb, adminAuth };
