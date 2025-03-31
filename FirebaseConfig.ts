import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0MTJEF0WWnrq1WB8me0hyCFjGUvRBQJQ",
  authDomain: "esf-project-b73ea.firebaseapp.com",
  projectId: "esf-project-b73ea",
  storageBucket: "esf-project-b73ea.firebasestorage.app",
  messagingSenderId: "285826746923",
  appId: "1:285826746923:web:5610460984fc244e78786e",
  measurementId: "G-BE6L1DJQBC"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);