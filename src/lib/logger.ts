
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { adminDb, initializeAdmin, isInitialized } from './firebase-admin';

type LogDetails = {
  [key: string]: any;
};

type LogQueueItem = {
    userEmail: string | null;
    action: string;
    details: LogDetails;
    timestamp: Timestamp;
}

let logQueue: LogQueueItem[] = [];
let isRetrying = false;

async function flushQueue() {
    while(logQueue.length > 0) {
        const logItem = logQueue.shift(); // Get the first item
        if (logItem && adminDb) {
            try {
                await addDoc(collection(adminDb, 'logs'), logItem);
            } catch (error) {
                console.error('Error writing queued log to Firestore, re-queuing:', error);
                logQueue.unshift(logItem); // Add it back to the front
                // If flushing fails, stop and wait for the next retry cycle
                return;
            }
        }
    }
}

async function attemptRetry() {
    if (isRetrying) return;
    isRetrying = true;

    console.log("Attempting to re-initialize Firebase Admin and flush log queue...");

    initializeAdmin();

    if (isInitialized && adminDb) {
        console.log("Firebase Admin re-initialized successfully. Flushing queue...");
        await flushQueue();
    } else {
        console.log("Firebase Admin re-initialization failed. Logs will remain in queue.");
    }
    
    // Set a timeout to allow for another retry attempt after a delay
    setTimeout(() => {
        isRetrying = false;
        // If there are still items in the queue, trigger another attempt
        if (logQueue.length > 0) {
            attemptRetry();
        }
    }, 5000); // Retry every 5 seconds
}


export async function logActivity(userEmail: string | null, action: string, details: LogDetails = {}) {
    const logItem: LogQueueItem = {
        action,
        details,
        userEmail: userEmail || 'system@anonymous',
        timestamp: Timestamp.now(),
    };
    
    // If DB is ready, write directly and try to flush any existing queue
    if (isInitialized && adminDb) {
       // First, try to flush any items that were previously queued
       if (logQueue.length > 0) {
           await flushQueue();
       }
       // Then, write the current log
       try {
           await addDoc(collection(adminDb, 'logs'), logItem);
       } catch (error) {
           console.error('Error writing log to Firestore, adding to queue:', error);
           logQueue.push(logItem);
           attemptRetry();
       }
    } else {
        // If DB is not ready, queue the log and start the retry mechanism
        console.log(`Firebase Admin not ready. Queuing log for action: ${action}`);
        logQueue.push(logItem);
        attemptRetry();
    }
}
