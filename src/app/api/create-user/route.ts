
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import type { UserRole, UserVertical } from '@/components/admin/UserDialog';

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;

export async function POST(req: Request) {
    if (!adminAuth || !adminDb) {
        return NextResponse.json({ error: 'Firebase Admin has not been initialized.' }, { status: 500 });
    }

    try {
        const { email, role, uid, phone, vertical } = (await req.json()) as {email: string, role: UserRole, uid?: string, phone?: string, vertical?: UserVertical};

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }
        
        const isPhoneMandatory = role === 'volunteer' || role === 'poc';
        const isPhoneOptional = role === 'admin' || role === 'superadmin';
        const needsPhone = isPhoneMandatory || isPhoneOptional;
        const needsVertical = role === 'volunteer' || role === 'poc';

        if (isPhoneMandatory && (!phone || !indianPhoneNumberRegex.test(phone))) {
             return NextResponse.json({ error: 'A valid Indian phone number is required for Volunteers and POCs.' }, { status: 400 });
        }
        
        if (phone && needsPhone && !indianPhoneNumberRegex.test(phone)) {
             return NextResponse.json({ error: 'Please provide a valid Indian phone number.' }, { status: 400 });
        }
        
        if (needsVertical && !vertical) {
             return NextResponse.json({ error: 'A vertical is required for Volunteers and POCs.' }, { status: 400 });
        }


        const claims: { [key: string]: any } = { role };
        if (needsPhone && phone) {
            claims.phone = phone;
        }

        if (needsVertical && vertical) {
            claims.vertical = vertical;
        }

        const firestoreData: { [key: string]: any } = { role, phone: claims.phone || null, vertical: claims.vertical || null };

        if (uid) { // This is an edit operation
            await adminAuth.setCustomUserClaims(uid, claims);
            await adminDb.collection('users').doc(uid).set(firestoreData, { merge: true });
            
            return NextResponse.json({ message: 'User updated successfully', uid, isNewUser: false });

        } else { // This is a create or "import" operation
            try {
                // Check if user already exists
                const existingUser = await adminAuth.getUserByEmail(email);

                // If user exists, update their role (import them)
                await adminAuth.setCustomUserClaims(existingUser.uid, claims);
                await adminDb.collection('users').doc(existingUser.uid).set({
                    uid: existingUser.uid,
                    email: existingUser.email,
                    ...firestoreData
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
                        ...firestoreData,
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
