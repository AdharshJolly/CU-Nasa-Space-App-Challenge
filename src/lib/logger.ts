
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { adminDb } from './firebase-admin';

type LogDetails = {
  [key: string]: any;
};

export async function logActivity(userEmail: string | null, action: string, details: LogDetails = {}) {
    if (!adminDb) {
        console.error("CRITICAL: Admin DB not initialized. Cannot log activity. Check firebase-admin.ts setup.");
        return;
    }

    const logItem = {
        action,
        details,
        userEmail: userEmail || 'system@anonymous',
        timestamp: Timestamp.now(),
    };

    try {
        await addDoc(collection(adminDb, 'logs'), logItem);
    } catch (error) {
        console.error('Failed to log activity to Firestore:', error);
    }
}
