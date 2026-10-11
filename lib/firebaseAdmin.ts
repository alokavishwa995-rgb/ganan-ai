// lib/firebaseAdmin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp;

if (!getApps().length) {
  let rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
  
  // 💡 වැදගත්: Vercel එකේ හෝ Local එකේ Quotes (") අත්වැරදීමකින් එකතු වී තිබේ නම් ඒවා ඉවත් කරයි
  rawKey = rawKey.replace(/^["']|["']$/g, "");
  
  // 💡 \n අකුරු ලෙස ඇති ඒවා සැබෑ නව පෙළ (Newlines) බවට පත් කරයි
  const privateKey = rawKey.replace(/\\n/g, "\n");

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }
} else {
  adminApp = getApps()[0];
}

export const adminDb = adminApp ? getFirestore(adminApp) : ({} as any);
export const adminAuth = adminApp ? getAuth(adminApp) : ({} as any);