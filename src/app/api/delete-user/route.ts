
import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { logActivity } from '@/lib/logger';

// Function to initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
    if (getApps().length > 0) {
        return;
    }
    
    if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
        throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
    }
    
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
        initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse FIREBASE_ADMIN_PRIVATE_KEY. Please ensure it is a valid JSON string.');
        }
        throw error;
    }
};

export async function POST(req: Request) {
    try {
        initializeFirebaseAdmin();
        const auth = getAuth();
        const db = getFirestore();

        const { uid, deletedBy } = await req.json();

        if (!uid) {
            return NextResponse.json({ error: 'User ID (uid) is required' }, { status: 400 });
        }
        
        // Fetch user to get email for logging before deletion
        const userRecord = await auth.getUser(uid);
        const userEmail = userRecord.email;

        // Delete from Firebase Authentication
        await auth.deleteUser(uid);

        // Delete from Firestore 'users' collection
        await db.collection('users').doc(uid).delete();
        
        // Log the action
        await logActivity(deletedBy, 'User Deleted', { deletedUserUid: uid, deletedUserEmail: userEmail });

        return NextResponse.json({ message: 'User deleted successfully' });

    } catch (error: any) {
        console.error('Error deleting user:', error);
        if (error.code === 'auth/user-not-found') {
            return NextResponse.json({ error: 'User not found in Firebase Authentication.' }, { status: 404 });
        }
        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
