import { auth } from "@/firebase.config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

class AuthService {
  constructor() {
    this.user = null;
    this.authStateListeners = new Set();
    this.initializeAuth();
  }

  async initializeAuth() {
    try {
      await setPersistence(auth, browserLocalPersistence);
      onAuthStateChanged(auth, (user) => {
        this.user = user;
        this.notifyListeners(user);
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
    }
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.user;
  }

  getCurrentUser() {
    return this.user;
  }

  addAuthStateListener(listener) {
    this.authStateListeners.add(listener);
    // Immediately notify the new listener of the current auth state
    listener(this.user);
  }

  removeAuthStateListener(listener) {
    this.authStateListeners.delete(listener);
  }

  notifyListeners(user) {
    this.authStateListeners.forEach(listener => listener(user));
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;
