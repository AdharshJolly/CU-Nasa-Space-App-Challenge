
import { NextResponse } from 'next/server';
import { initializeAdminApp } from '@/lib/firebase-admin';
import type { UserRole, UserVertical } from '@/components/admin/UserDialog';
import { logActivity } from '@/lib/logger';

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;

export async function POST(req: Request) {
    try {
        const { adminAuth, adminDb } = initializeAdminApp();
        const { email, role, uid, phone, vertical, createdBy } = (await req.json()) as {email: string, role: UserRole, uid?: string, phone?: string, vertical?: UserVertical, createdBy?: string};

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }
        
        const isPhoneMandatory = role === 'volunteer' || role === 'poc';
        const needsPhone = isPhoneMandatory || role === 'admin' || role === 'superadmin';
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

        let targetUid = uid;
        let isNewUser = false;

        if (uid) { // This is an edit operation
            await adminAuth.setCustomUserClaims(uid, claims);
            await adminDb.collection('users').doc(uid).set(firestoreData, { merge: true });

        } else { // This is a create or "import" operation
            try {
                // Check if user already exists
                const existingUser = await adminAuth.getUserByEmail(email);
                targetUid = existingUser.uid;

                // If user exists, update their role (import them)
                await adminAuth.setCustomUserClaims(existingUser.uid, claims);
                await adminDb.collection('users').doc(existingUser.uid).set({
                    uid: existingUser.uid,
                    email: existingUser.email,
                    ...firestoreData
                }, { merge: true });

            } catch (error: any) {
                 if (error.code === 'auth/user-not-found') {
                    // User does not exist, so create them without a password
                    const newUserRecord = await adminAuth.createUser({
                        email,
                        emailVerified: false, // User will verify when setting password
                    });
                    
                    targetUid = newUserRecord.uid;
                    isNewUser = true;
            
                    await adminAuth.setCustomUserClaims(newUserRecord.uid, claims);
            
                    await adminDb.collection('users').doc(newUserRecord.uid).set({
                        uid: newUserRecord.uid,
                        email,
                        ...firestoreData,
                        createdAt: new Date().toISOString(),
                    });
            
                 } else {
                    // Re-throw other errors
                    throw error;
                 }
            }
        }
        
        // Logging
        const logAction = uid ? 'User Updated' : (isNewUser ? 'User Created' : 'User Imported');
        const logDetails = { targetUser: email, role, phone: claims.phone, vertical: claims.vertical };
        await logActivity(createdBy, logAction, logDetails);

        return NextResponse.json({ 
            message: 'User operation successful.', 
            uid: targetUid, 
            isNewUser 
        });

    } catch (error: any) {
        console.error('Error creating/updating user:', error);
        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
