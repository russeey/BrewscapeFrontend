import { auth } from "@/firebase.config"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";

const authService = {
  isAuthenticated: false,

  // Method to check authentication status
  checkAuth(callback) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isAuthenticated = true;
        callback(true); // User is signed in
      } else {
        this.isAuthenticated = false;
        callback(false); // User is signed out
      }
    });
  },
};

export default authService;
