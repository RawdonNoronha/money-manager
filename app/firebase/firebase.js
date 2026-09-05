import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || process.env.AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || process.env.PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || process.env.MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID || process.env.APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || process.env.MEASUREMENT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);