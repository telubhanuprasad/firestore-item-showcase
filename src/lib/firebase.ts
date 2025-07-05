
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnNSVaX1k1j7mF5LDZ8K7ZGlyRyAzRyVU",
  authDomain: "test-87a1f.firebaseapp.com",
  projectId: "test-87a1f",
  storageBucket: "test-87a1f.firebasestorage.app",
  messagingSenderId: "422947695750",
  appId: "1:422947695750:web:68a8c1b624645b844ff507",
  measurementId: "G-XSF35YS36B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
