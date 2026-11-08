import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { firebaseConfig, firebaseReady } from './firebase-config';

export const firebaseApp = firebaseReady ? (getApps()[0] || initializeApp(firebaseConfig)) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
