
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { adminDb } from './firebase-admin'; // Directly import the initialized instance

type LogDetails = {
  [key: string]: any;
};

export async function logActivity(userEmail: string | null, action: string, details: LogDetails = {}) {
    try {
        const logItem = {
            action,
            details,
            userEmail: userEmail || 'system@anonymous',
            timestamp: Timestamp.now(),
        };

        await addDoc(collection(adminDb, 'logs'), logItem);
    } catch (error) {
        console.error('Failed to log activity to Firestore:', error);
    }
}
