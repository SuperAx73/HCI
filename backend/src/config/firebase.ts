import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function buildApp(): App {
  if (getApps().length) return getApps()[0]!;

  if (process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    return initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID ?? 'oficios-dev' });
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT env var is required outside of emulator mode');
  }
  return initializeApp({
    credential: cert(JSON.parse(serviceAccountJson)),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const app = buildApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
