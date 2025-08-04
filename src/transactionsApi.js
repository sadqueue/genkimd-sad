// transactionsApi.js (Firestore version)

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  limit,
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  where,
} from "firebase/firestore";
import { ENV_POINT_TO } from "./constants";
import { db } from "./firebaseConfig";

// Helper to recursively remove undefined fields
const removeUndefinedDeep = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedDeep);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefinedDeep(v)])
    );
  }
  return obj;
};


// Fetch config from Firestore
export const fetchConfigValues = async () => {
  try {
    const configDoc = await getDoc(doc(db, "config", "default"));
    if (configDoc.exists()) {
      console.log("Config data fetched:", configDoc.data());
      return configDoc.data();
    } else {
      console.warn("No configuration found in Firestore.");
      return {};
    }
  } catch (error) {
    console.error("Error fetching config from Firestore:", error);
    return {};
  }
};

// Update config value
export const updateConfigValue = async (key, value) => {
  try {
    await updateDoc(doc(db, "config", "default"), { [key]: value });
    console.log(`${key} updated successfully.`);
  } catch (error) {
    console.error(`Error updating ${key}:`, error);
  }
};

// Initialize config values if missing
export const initializeConfigValues = async () => {
  try {
    const configRef = doc(db, "config", "default");
    const snapshot = await getDoc(configRef);

    if (!snapshot.exists()) {
      const defaultConfig = {
        ALR_5PM: 0.6,
        CLR_5PM: 0.4,
        ALR_7PM: 0.7,
        CLR_7PM: 0.3,
        P95_7PM: 180,
        P95_5PM: 180,
        CONSTANT_COMPOSITE_5PM_N5: 0.49,
        CONSTANT_COMPOSITE_7PM_N1: 0.49,
        CONSTANT_COMPOSITE_7PM_N2: 0.59,
        CONSTANT_COMPOSITE_7PM_N3: 0.69,
        CONSTANT_COMPOSITE_7PM_N4: 0.79
      };
      await setDoc(configRef, defaultConfig);
      console.log("Initialized default config values.");
    }
  } catch (error) {
    console.error("Error initializing config:", error);
  }
};

export const getFirestoreCollectionPath = (startTime) => {
  const suffix =
    ENV_POINT_TO === "prod"
      ? `transactions_${startTime}`
      : window.location.hostname === "localhost"
      ? `transactions_local_${startTime}`
      : `transactions_${startTime}`;
  return suffix;
};

export const getLast10Transactions = async (admissionsObj) => {
  const colPath = getFirestoreCollectionPath(admissionsObj.startTime);
  const q = query(collection(db, colPath), orderBy("timestamp", "desc"), limit(10));

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const addTransaction = async (admissionsObj, order, copyBox) => {
  const colPath = getFirestoreCollectionPath(admissionsObj.startTime);

  try {
    const getUserDeviceDetails = () => ({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    });

    const timestamp = new Date();
    const localDateTime = timestamp.toLocaleString("en-US");

    const newTransaction = {
      timestamp,
      localDateTime,
      userDeviceDetails: getUserDeviceDetails(),
      admissionsObj: admissionsObj || {},
      order: order || "",
      deleted: false,
    };

    // Clean undefined values
    const cleanedTransaction = removeUndefinedDeep(newTransaction);

    const docRef = await addDoc(collection(db, colPath), cleanedTransaction);
    return { success: true, key: docRef.id };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, error };
  }
};

export const getLast50Transactions = async (admissionsObj) => {
  const colPath = getFirestoreCollectionPath(admissionsObj.startTime);
  const q = query(collection(db, colPath), orderBy("timestamp", "desc"), limit(100));

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        timestamp: doc.data().localDateTime || "N/A",
        orderOfAdmissions: doc.data().order?.split(">") || [],
        shifts: doc.data().admissionsObj?.allAdmissionsDataShifts?.shifts || [],
        deleted: doc.data().deleted || false,
      }))
      .filter(tx => !tx.deleted);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getAllTransactions = async (startTime) => {
  const colPath = getFirestoreCollectionPath(startTime);
  const q = query(collection(db, colPath), orderBy("timestamp"));

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        timestamp: doc.data().localDateTime || "N/A",
        orderOfAdmissions: doc.data().order?.split(">") || [],
        shifts: doc.data().admissionsObj?.allAdmissionsDataShifts?.shifts || [],
        deleted: doc.data().deleted || false,
      }))
      .filter(tx => !tx.deleted);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const deleteAllTransactions = async (startTime) => {
  const colPath = getFirestoreCollectionPath(startTime);
  const snapshot = await getDocs(collection(db, colPath));
  const deletions = snapshot.docs.map(docSnap => deleteDoc(doc(db, colPath, docSnap.id)));

  try {
    await Promise.all(deletions);
    console.log("All transactions deleted.");
  } catch (error) {
    console.error("Error deleting all transactions:", error);
  }
};

export const deleteTransaction = async (startTime, transactionId) => {
  const colPath = getFirestoreCollectionPath(startTime);
  try {
    await updateDoc(doc(db, colPath, transactionId), { deleted: true });
    console.log(`Transaction ${transactionId} marked as deleted.`);
  } catch (error) {
    console.error(`Error deleting transaction ${transactionId}:`, error);
  }
};

export const hardDeleteTransaction = async (startTime, transactionId) => {
  const colPath = getFirestoreCollectionPath(startTime);
  try {
    await deleteDoc(doc(db, colPath, transactionId));
    console.log(`Transaction ${transactionId} permanently deleted.`);
  } catch (error) {
    console.error(`Error hard-deleting transaction ${transactionId}:`, error);
  }
};

export const getMostRecentTransaction = async (startTime) => {
  try {
    const colPath = getFirestoreCollectionPath(startTime);
    const q = query(
      collection(db, colPath),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        success: true,
        transaction: {
          id: doc.id,
          ...doc.data(),
        },
      };
    } else {
      return {
        success: false,
        message: "No transactions found.",
      };
    }
  } catch (error) {
    console.error("Error fetching the most recent transaction:", error);
    return { success: false, error };
  }
};

export const updateTransaction = async (startTime, transactionId, updatedTransaction) => {
  const colPath = getFirestoreCollectionPath(startTime);
  try {
    const { deleted, ...dataToUpdate } = updatedTransaction;
    await updateDoc(doc(db, colPath, transactionId), dataToUpdate);
    console.log(`Transaction ${transactionId} updated.`);
    return { success: true };
  } catch (error) {
    console.error(`Error updating transaction ${transactionId}:`, error);
    throw error;
  }
};
