// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Add this to use Firebase Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd7OfM_4Zf3iVriUHqt_pLK9atPSM7X_w",
  authDomain: "brewscapes-9c98a.firebaseapp.com",
  projectId: "brewscapes-9c98a",
  storageBucket: "brewscapes-9c98a",
  messagingSenderId: "772139168241",
  appId: "1:772139168241:web:0516626787ec37b4825450",
  measurementId: "G-6MVPTCKR0N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Export the auth instance so you can import it in other components
export const auth = getAuth(app);

export default app;
