
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { adminDb } from './firebase-admin';

type LogDetails = {
  [key: string]: any;
};

export async function logActivity(userEmail: string | null, action: string, details: LogDetails = {}) {
  try {
    // Ensure the admin instance is ready before proceeding
    if (!adminDb) {
        console.error("Firebase Admin has not been initialized. Log will not be written.");
        return;
    }

    const emailToLog = userEmail || 'system@anonymous';
    
    await addDoc(collection(adminDb, 'logs'), {
      action,
      details,
      userEmail: emailToLog,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error writing to activity log:', {
      action,
      details,
      userEmail,
      error,
    });
    // Re-throwing the error or handling it might be necessary depending on requirements
    // For now, we just log it to the server console.
  }
}
