import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "sky-ai-forex-pro.firebaseapp.com",
  projectId: "sky-ai-forex-pro",
  storageBucket: "sky-ai-forex-pro.firebasestorage.app",
  messagingSenderId: "638582998955",
  appId: "1:638582998955:web:c329d3fb82da1b393074ee",
  measurementId: "G-FY5TJ2PNHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
