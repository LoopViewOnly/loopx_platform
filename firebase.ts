import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { ENABLE_FIREBASE, firebaseConfig, hasFirebaseConfig } from './config/featureFlags';


let db: firebase.firestore.Firestore | null = null;
export let isFirebaseEnabled = false;

// Only initialize Firebase when explicitly enabled and fully configured.
if (ENABLE_FIREBASE && hasFirebaseConfig) {
  try {
    // This check prevents re-initializing the app on hot reloads
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    isFirebaseEnabled = true;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase disabled or missing configuration. Leaderboard backend calls are skipped and the UI runs frontend-only.");
}

export { db };