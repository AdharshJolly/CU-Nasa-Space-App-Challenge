"use server";

import { initializeAdminApp } from "./firebase-admin";

type LogDetails = {
  [key: string]: any;
};

type LogLevel = "info" | "warn" | "error" | "success";

export async function logActivity(
  userEmail: string | null,
  action: string,
  details: LogDetails = {},
  level: LogLevel = "info"
) {
  // Fire and forget - don't wait for logging to complete
  setImmediate(async () => {
    try {
      const { adminDb } = initializeAdminApp();
      const logItem = {
        action,
        details,
        userEmail: userEmail || "system@anonymous",
        timestamp: new Date(),
        level,
        source: "web-app", // Identify the source of the log
      };

      await adminDb.collection("logs").add(logItem);
    } catch (error) {
      // Log to server console if Firestore logging fails
      console.error("Failed to log activity to Firestore:", error);
    }
  });
}

// Specialized logging functions for different types of activities
export async function logAuth(
  userEmail: string | null,
  action: "login_success" | "login_failed" | "logout",
  details: LogDetails = {}
) {
  await logActivity(
    userEmail,
    `Auth: ${action}`,
    details,
    action === "login_failed" ? "warn" : "success"
  );
}

export async function logAPI(
  userEmail: string | null,
  endpoint: string,
  method: string,
  details: LogDetails = {}
) {
  await logActivity(userEmail, `API: ${method} ${endpoint}`, details, "info");
}

export async function logError(
  userEmail: string | null,
  action: string,
  error: Error | string,
  details: LogDetails = {}
) {
  const errorDetails = {
    ...details,
    error: typeof error === "string" ? error : error.message,
    stack: typeof error === "object" ? error.stack : undefined,
  };
  await logActivity(userEmail, `Error: ${action}`, errorDetails, "error");
}

export async function logPageAccess(
  userEmail: string | null,
  page: string,
  userRole?: string
) {
  await logActivity(
    userEmail,
    `Page Access: ${page}`,
    {
      page,
      userRole,
      timestamp: new Date().toISOString(),
    },
    "info"
  );
}
