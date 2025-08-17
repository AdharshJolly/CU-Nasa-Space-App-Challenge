
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { adminDb } from './firebase-admin';

type LogDetails = {
  [key: string]: any;
};

export async function logActivity(userEmail: string | null, action: string, details: LogDetails = {}) {
  // Ensure the admin instance is ready before proceeding.
  if (!adminDb) {
      console.error("Firebase Admin DB has not been initialized. Log will not be written for action:", action);
      return;
  }

  try {
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
    // For now, we just log it to the server console.
  }
}
