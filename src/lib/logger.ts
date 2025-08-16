
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

type LogDetails = {
  [key: string]: any;
};

export async function logActivity(action: string, details: LogDetails = {}) {
  try {
    const user = auth.currentUser;
    const userEmail = user ? user.email : 'system@anonymous';

    await addDoc(collection(db, 'logs'), {
      action,
      details,
      userEmail,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error writing to activity log:', error);
    // Depending on requirements, you might want to handle this more robustly
  }
}
