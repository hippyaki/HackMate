import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_AREACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_AREACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_AREACT_APP_FIREBASE_PROJECT_ID
};

const appFB = initializeApp(firebaseConfig);
export const db = getFirestore(appFB);
