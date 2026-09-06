import { initializeApp } from "firebase/app";
import { getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || process.env.AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || process.env.PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || process.env.MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID || process.env.APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || process.env.MEASUREMENT_ID,
};

// Reuse the existing app during development so hot reload does not initialize
// Firebase more than once.
const existingApps = getApps();
const app = existingApps.length > 0
  ? existingApps[0]
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Export the Auth service so authentication flows use the same Firebase app.
export const auth = getAuth(app);

// export const getCurrentUser = async () => {
//   return new Promise((resolve) => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const uid = user.uid;
//         console.log("User is signed in:", user);
//         resolve(user);
//       } else {
//         console.log("No user is signed in");
//         resolve(null);
//       }
//     })
//   });
// }
