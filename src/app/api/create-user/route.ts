
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import type { UserRole } from '@/components/admin/UserDialog';

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;

export async function POST(req: Request) {
    if (!adminAuth || !adminDb) {
        console.error("Firebase Admin has not been initialized in API route.");
        return NextResponse.json({ error: 'Firebase Admin has not been initialized.' }, { status: 500 });
    }

    try {
        const { email, role, uid, phone } = (await req.json()) as {email: string, role: UserRole, uid?: string, phone?: string};

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }

        const isNewRolePhoneRequired = role === 'volunteer' || role === 'poc';

        if (isNewRolePhoneRequired && (!phone || !indianPhoneNumberRegex.test(phone))) {
             return NextResponse.json({ error: 'A valid Indian phone number is required for Volunteers and POCs.' }, { status: 400 });
        }

        if (uid) { // This is an edit operation
            const userRecord = await adminAuth.getUser(uid);
            const existingClaims = userRecord.customClaims || {};
            const newClaims = { ...existingClaims, role };

            // If the new role requires a phone, add it.
            if (isNewRolePhoneRequired) {
                newClaims.phone = phone;
            } else {
                // If the new role does not require a phone, remove it if it exists.
                delete newClaims.phone;
            }

            await adminAuth.setCustomUserClaims(uid, newClaims);
            await adminDb.collection('users').doc(uid).update({ role });
            
            return NextResponse.json({ message: 'User updated successfully', uid, isNewUser: false });

        } else { // This is a create or "import" operation
            const claims: { [key: string]: any } = { role };
            if (isNewRolePhoneRequired) {
                claims.phone = phone;
            }
            
            try {
                // Check if user already exists
                const existingUser = await adminAuth.getUserByEmail(email);

                // If user exists, update their role (import them)
                await adminAuth.setCustomUserClaims(existingUser.uid, claims);
                await adminDb.collection('users').doc(existingUser.uid).set({
                    uid: existingUser.uid,
                    email: existingUser.email,
                    role,
                }, { merge: true });

                return NextResponse.json({ message: `Existing user ${email} updated with new role.`, uid: existingUser.uid, isNewUser: false });

            } catch (error: any) {
                 if (error.code === 'auth/user-not-found') {
                    // User does not exist, so create them without a password
                    const newUserRecord = await adminAuth.createUser({
                        email,
                        emailVerified: false, // User will verify when setting password
                    });
            
                    await adminAuth.setCustomUserClaims(newUserRecord.uid, claims);
            
                    await adminDb.collection('users').doc(newUserRecord.uid).set({
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
