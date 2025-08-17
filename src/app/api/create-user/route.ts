
import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

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
        // Provide a more specific error for JSON parsing issues.
        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse FIREBASE_ADMIN_PRIVATE_KEY. Please ensure it is a valid JSON string.');
        }
        throw error; // Re-throw other initialization errors.
    }
};


export async function POST(req: Request) {
    try {
        initializeFirebaseAdmin(); // Ensure Firebase Admin is initialized on each request
        const auth = getAuth();
        const db = getFirestore();

        const { email, role, uid } = await req.json();

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }

        if (uid) { // This is an edit operation
            // Update custom claims
            await auth.setCustomUserClaims(uid, { role });

            // Update role in Firestore
            await db.collection('users').doc(uid).update({ role });
            
            return NextResponse.json({ message: 'User updated successfully', uid, isNewUser: false });

        } else { // This is a create or "import" operation
            try {
                // Check if user already exists
                const existingUser = await auth.getUserByEmail(email);

                // If user exists, update their role (import them)
                await auth.setCustomUserClaims(existingUser.uid, { role });
                await db.collection('users').doc(existingUser.uid).set({
                    uid: existingUser.uid,
                    email: existingUser.email,
                    role,
                    createdAt: existingUser.metadata.creationTime,
                }, { merge: true });

                return NextResponse.json({ message: `Existing user ${email} updated with new role.`, uid: existingUser.uid, isNewUser: false });

            } catch (error: any) {
                 if (error.code === 'auth/user-not-found') {
                    // User does not exist, so create them without a password
                    const newUserRecord = await auth.createUser({
                        email,
                        emailVerified: false, // User will verify when setting password
                    });
            
                    await auth.setCustomUserClaims(newUserRecord.uid, { role });
            
                    await db.collection('users').doc(newUserRecord.uid).set({
                        uid: newUserRecord.uid,
                        email,
                        role,
                        createdAt: new Date().toISOString(),
                    });
            
                    // The client will now trigger the password reset email
                    return NextResponse.json({ message: 'User created successfully', uid: newUserRecord.uid, isNewUser: true });
                 } else {
                    // Re-throw other errors
                    throw error;
                 }
            }
        }

    } catch (error: any) {
        console.error('Error creating/updating user:', error);
        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
