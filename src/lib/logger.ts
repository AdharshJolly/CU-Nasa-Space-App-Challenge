"use server";

import { initializeAdminApp } from "./firebase-admin";

type LogDetails = {
  [key: string]: any;
};

export async function logActivity(
  userEmail: string | null,
  action: string,
  details: LogDetails = {}
) {
  try {
    const { adminDb } = initializeAdminApp(); // Ensure adminDb is initialized
    const logItem = {
      action,
      details,
      userEmail: userEmail || "system@anonymous",
      timestamp: new Date(), // Use native Date object for Admin SDK
    };

    await adminDb.collection("logs").add(logItem);
  } catch (error) {
    // Log to server console if Firestore logging fails
    console.error("Failed to log activity to Firestore:", error);
  }
}
