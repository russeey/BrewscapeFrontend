import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore"; // Added query and where imports

const firebaseConfig = {
  apiKey: "AIzaSyDd7OfM_4Zf3iVriUHqt_pLK9atPSM7X_w",
  authDomain: "brewscapes-9c98a.firebaseapp.com",
  projectId: "brewscapes-9c98a",
  storageBucket: "brewscapes-9c98a.appspot.com",
  messagingSenderId: "772139168241",
  appId: "1:772139168241:web:0516626787ec37b4825450",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, addDoc, collection, getDocs, query, where }; // Exporting query and where
