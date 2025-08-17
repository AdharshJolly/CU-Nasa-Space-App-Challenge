
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

type LogDetails = {
  [key: string]: any;
};

export async function logActivity(userEmail: string | null, action: string, details: LogDetails = {}) {
  try {
    const emailToLog = userEmail || 'system@anonymous';
    
    await addDoc(collection(db, 'logs'), {
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
