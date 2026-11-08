import { getAuth } from 'firebase/auth';
import { firebaseApp } from './firebase';
import { firebaseReady } from './firebase-config';

export const auth = firebaseReady && firebaseApp ? getAuth(firebaseApp) : null;
