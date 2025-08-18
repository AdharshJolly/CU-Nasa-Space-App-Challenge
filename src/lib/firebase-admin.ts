
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

let adminDb: ReturnType<typeof getFirestore>;
let adminAuth: ReturnType<typeof getAuth>;

/**
 * Initializes the Firebase Admin SDK if it hasn't been already.
 * This ensures that we have a single instance of the admin app.
 */
function initializeAdmin() {
    if (getApps().length > 0) {
        return;
    }

    if (!serviceAccountKey) {
        throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
    }

    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        initializeApp({
            credential: cert(serviceAccount)
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("Firebase Admin SDK initialization error:", (error as Error).message);
        throw new Error("Failed to initialize Firebase Admin SDK. Please check your FIREBASE_ADMIN_PRIVATE_KEY.");
    }
}

// Initialize on load.
initializeAdmin();

// Export instances directly.
adminDb = getFirestore();
adminAuth = getAuth();

export { adminDb, adminAuth };
