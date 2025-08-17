
import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY as string);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const auth = getAuth();
const db = getFirestore();

export async function POST(req: Request) {
    try {
        const { email, password, role, uid } = await req.json();

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }

        if (uid) { // This is an edit operation
            // Update custom claims
            await auth.setCustomUserClaims(uid, { role });

            // Update role in Firestore
            await db.collection('users').doc(uid).update({ role });
            
            return NextResponse.json({ message: 'User updated successfully', uid });

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

                return NextResponse.json({ message: `Existing user ${email} updated with new role.`, uid: existingUser.uid });

            } catch (error: any) {
                 if (error.code === 'auth/user-not-found') {
                    // User does not exist, so create them
                    if (!password || password.length < 6) {
                        return NextResponse.json({ error: 'Password is required and must be at least 6 characters long for new users.' }, { status: 400 });
                    }
                    const newUserRecord = await auth.createUser({
                        email,
                        password,
                        emailVerified: true, 
                    });
            
                    await auth.setCustomUserClaims(newUserRecord.uid, { role });
            
                    await db.collection('users').doc(newUserRecord.uid).set({
                        uid: newUserRecord.uid,
                        email,
                        role,
                        createdAt: new Date().toISOString(),
                    });
            
                    return NextResponse.json({ message: 'User created successfully', uid: newUserRecord.uid });
                 } else {
                    // Re-throw other errors
                    throw error;
                 }
            }
        }

    } catch (error: any) {
        console.error('Error creating/updating user:', error);
        // Provide more specific error messages
        if (error.code === 'auth/invalid-password') {
             return NextResponse.json({ error: 'The password must be a string with at least six characters.' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
