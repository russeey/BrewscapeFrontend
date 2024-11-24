// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDd7OfM_4Zf3iVriUHqt_pLK9atPSM7X_w",
  authDomain: "brewscapes-9c98a.firebaseapp.com",
  projectId: "brewscapes-9c98a",
  storageBucket: "brewscapes-9c98a.appspot.com",
  messagingSenderId: "772139168241",
  appId: "1:772139168241:web:0516626787ec37b4825450",
  measurementId: "G-6MVPTCKR0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
export default app;
