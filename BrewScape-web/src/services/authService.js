import { auth, db } from "@/firebase.config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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

  async signup(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      if (userData.role === 'admin') {
        await setDoc(doc(db, "admins", user.uid), {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          location: userData.location,
          birthday: userData.birthday,
          gender: userData.gender,
        });
      } else {
        await this.signupUser(userData); // Call the new method for users
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signupUser(userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        birthday: userData.birthday,
        gender: userData.gender,
      });

      return user;
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
    this.authStateListeners.forEach((listener) => listener(user));
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;