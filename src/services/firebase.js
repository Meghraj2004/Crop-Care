// Firebase SDK Configuration & Real-Time Initialization with Resilient Multi-Sync
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDUoPMaZ7IWSAXS6bwcaBduUXd_bm_mYGY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cropcare-21809.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cropcare-21809",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cropcare-21809.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "903701833417",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:903701833417:web:a5eb28a0a51aa0c27f0f18",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MBLTT8EHHM"
};

let app;
let auth;
let db;
let storage;

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization warning (falling back gracefully):", error);
}

export { app, auth, db, storage, isFirebaseConfigured };
