
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1DgbbMbK893fWtkYtQttOCQw9TrFIE0",
  authDomain: "sky-ai-forex-pro.firebaseapp.com",
  projectId: "sky-ai-forex-pro",
  storageBucket: "sky-ai-forex-pro.firebasestorage.app",
  messagingSenderId: "638582998955",
  appId: "1:638582998955:web:c329d3fb82da1b393074ee",
  measurementId: "G-FY5TJ2PNHR"
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
