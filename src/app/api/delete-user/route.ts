
import { NextResponse } from 'next/server';
import { logActivity } from '@/lib/logger';
import { adminAuth, adminDb } from '@/lib/firebase-admin';


export async function POST(req: Request) {
    if (!adminAuth || !adminDb) {
        console.error("Firebase Admin has not been initialized in API route.");
        return NextResponse.json({ error: 'Firebase Admin has not been initialized.' }, { status: 500 });
    }

    try {
        const { uid, deletedBy } = await req.json();

        if (!uid) {
            return NextResponse.json({ error: 'User ID (uid) is required' }, { status: 400 });
        }
        
        // Fetch user to get email for logging before deletion
        const userRecord = await adminAuth.getUser(uid);
        const userEmail = userRecord.email;

        // Delete from Firebase Authentication
        await adminAuth.deleteUser(uid);

        // Delete from Firestore 'users' collection
        await adminDb.collection('users').doc(uid).delete();
        
        // Log the action
        if (deletedBy && userEmail) {
            await logActivity(deletedBy, 'User Deleted', { deletedUserUid: uid, deletedUserEmail: userEmail });
        }

        return NextResponse.json({ message: 'User deleted successfully' });

    } catch (error: any) {
        console.error('Error deleting user:', error);
        if (error.code === 'auth/user-not-found') {
            return NextResponse.json({ error: 'User not found in Firebase Authentication.' }, { status: 404 });
        }
        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
