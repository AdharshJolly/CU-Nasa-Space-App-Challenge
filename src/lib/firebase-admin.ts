
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

const serviceAccountKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;

function initializeAdminApp() {
    if (getApps().length > 0) {
        if (app && adminDb && adminAuth) {
            return { app, adminDb, adminAuth };
        }
        app = getApps()[0];
    } else {
        if (!serviceAccountKey) {
            throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
        }
        const serviceAccount = JSON.parse(serviceAccountKey);
        app = initializeApp({
            credential: cert(serviceAccount),
        });
    }

    adminDb = getFirestore(app);
    adminAuth = getAuth(app);

    return { app, adminDb, adminAuth };
}

// Export the function to be used across server-side code
export { initializeAdminApp };
