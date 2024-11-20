import { auth } from "@/firebase.config";
import {
  signInWithEmailAndPassword,
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
      // Set persistence to LOCAL to maintain the session across page refreshes
      await setPersistence(auth, browserLocalPersistence);
      
      // Listen for auth state changes
      onAuthStateChanged(auth, (user) => {
        this.user = user;
        this.notifyListeners(user);
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
    }
  }

  // Add listener for auth state changes
  addAuthStateListener(listener) {
    this.authStateListeners.add(listener);
    // Immediately notify the listener of the current state
    listener(this.user);
  }

  // Remove listener
  removeAuthStateListener(listener) {
    this.authStateListeners.delete(listener);
  }

  // Notify all listeners of auth state change
  notifyListeners(user) {
    this.authStateListeners.forEach(listener => listener(user));
  }

  // Login with email and password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.user;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get user token
  async getUserToken() {
    if (!this.user) return null;
    try {
      return await this.user.getIdToken();
    } catch (error) {
      console.error("Error getting user token:", error);
      return null;
    }
  }

  // Helper to get readable error messages
  getErrorMessage(error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      default:
        return 'An error occurred during authentication';
    }
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;
