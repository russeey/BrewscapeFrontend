// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDd7OfM_4Zf3iVriUHqt_pLK9atPSM7X_w",
  authDomain: "brewscapes-9c98a.firebaseapp.com",
  projectId: "brewscapes-9c98a",
  storageBucket: "brewscapes-9c98a.firebasestorage.app",
  messagingSenderId: "772139168241",
  appId: "1:772139168241:web:775190f108316c62825450",
  measurementId: "G-GYVHGBW8E3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;