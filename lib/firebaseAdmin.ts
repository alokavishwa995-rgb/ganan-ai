import * as adminModule from 'firebase-admin';

// Handles CJS/ESM module export differences safely in Next.js & TypeScript
const admin: any = (adminModule as any).default || adminModule;

if (!admin.apps || !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          : undefined,
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// Get the initialized firebase app instance safely
const currentApp = admin.apps && admin.apps.length ? admin.apps[0] : null;

// Safe exports without any TypeScript property errors
export const adminDb = currentApp ? admin.firestore(currentApp) : ({} as any);
export const adminAuth = currentApp ? admin.auth(currentApp) : ({} as any);