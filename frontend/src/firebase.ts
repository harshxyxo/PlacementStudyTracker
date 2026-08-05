import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4dLYMbOj9R4Vu2FZBWLoU_ULuNA7vS_o",
  authDomain: "placemend-and-studytracker.firebaseapp.com",
  projectId: "placemend-and-studytracker",
  storageBucket: "placemend-and-studytracker.firebasestorage.app",
  messagingSenderId: "207434545734",
  appId: "1:207434545734:web:4a867064178ebf20be6847",
  measurementId: "G-CM4RRMD96H"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();