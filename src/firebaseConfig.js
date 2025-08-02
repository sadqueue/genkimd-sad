// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Use Firestore
import CONFIG1 from "./config";

const CONFIG = CONFIG1;

const firebaseConfig = {
  apiKey: CONFIG.REACT_APP_FIREBASE_API_KEY,
  authDomain: CONFIG.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: CONFIG.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: CONFIG.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: CONFIG.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: CONFIG.REACT_APP_FIREBASE_APP_ID,
  measurementId: CONFIG.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app); // ✅ Use getFirestore instead of getDatabase

export { app, db };
