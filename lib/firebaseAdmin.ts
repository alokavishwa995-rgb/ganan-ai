// lib/firebaseAdmin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp;

if (!getApps().length) {
  try {
    let serviceAccount;

    // විකල්ප 1: Base64 වලින් දාලා තියෙනවා නම්
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const decodedJson = Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
        "base64"
      ).toString("utf8");
      serviceAccount = JSON.parse(decodedJson);
    } 
    // විකල්ප 2: වෙනත් ක්‍රමයක් නම් (ProjectId, ClientEmail වෙන වෙනම)
    else {
      let rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
      rawKey = rawKey.trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");

      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: rawKey,
      };
    }

    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error("❌ Firebase Admin Initialization Error:", error);
  }
} else {
  adminApp = getApps()[0];
}

export const adminDb = adminApp ? getFirestore(adminApp) : ({} as any);
export const adminAuth = adminApp ? getAuth(adminApp) : ({} as any);