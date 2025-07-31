import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import CONFIG from "../../src/config";

const firebaseConfig = {
    apiKey: CONFIG.REACT_APP_FIREBASE_API_KEY,
    authDomain: CONFIG.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: CONFIG.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: CONFIG.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: CONFIG.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: CONFIG.REACT_APP_FIREBASE_APP_ID,
    measurementId: CONFIG.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy, onSnapshot };
