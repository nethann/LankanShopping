import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5tUYy8EcPIVvgM2AVAVPRHRPuEskoad8",
  authDomain: "lankanshopping-8a007.firebaseapp.com",
  projectId: "lankanshopping-8a007",
  storageBucket: "lankanshopping-8a007.firebasestorage.app",
  messagingSenderId: "822962844404",
  appId: "1:822962844404:web:a247920e2c4bad8754a4a1",
  measurementId: "G-XDZYVR561P",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
