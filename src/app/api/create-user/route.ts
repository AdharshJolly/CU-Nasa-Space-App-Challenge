
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

        } else { // This is a create operation
             if (!password || password.length < 6) {
                return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
            }
            // Create user in Auth
            const userRecord = await auth.createUser({
                email,
                password,
                emailVerified: true, // Or based on your flow
            });
    
            // Set custom claims for role-based access
            await auth.setCustomUserClaims(userRecord.uid, { role });
    
            // Store user info in Firestore
            await db.collection('users').doc(userRecord.uid).set({
                uid: userRecord.uid,
                email,
                role,
                createdAt: new Date().toISOString(),
            });
    
            return NextResponse.json({ message: 'User created successfully', uid: userRecord.uid });
        }


    } catch (error: any) {
        console.error('Error creating/updating user:', error);
        // Provide more specific error messages
        if (error.code === 'auth/email-already-exists') {
            return NextResponse.json({ error: 'This email is already in use by another account.' }, { status: 409 });
        }
        if (error.code === 'auth/invalid-password') {
             return NextResponse.json({ error: 'The password must be a string with at least six characters.' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
