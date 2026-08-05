import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TERI_API_KEY",
  authDomain: "placemend-and-studytracker.firebaseapp.com",
  projectId: "placemend-and-studytracker",
  storageBucket: "placemend-and-studytracker.firebasestorage.app",
  messagingSenderId: "207434545734",
  appId: "1:207434545734:web:4a867064178ebf20be6847",
  measurementId: "G-CM4RRMD96H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// YE DONO LINES SABSE ZAROORI HAIN (Inhi ka error aa raha hai)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();