import { auth, db } from "@/firebase.config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

class AuthService {
  constructor() {
    this.user = null;
    this.listenForAuthChanges();
  }

  // Listens for auth state changes and updates the current user
  listenForAuthChanges() {
    onAuthStateChanged(auth, (user) => {
      this.user = user; // Updates the current user when auth state changes
      console.log("Auth state updated:", user);
    });
  }

  // Checks if the user is authenticated (logged in)
  isAuthenticated() {
    return !!this.user; // Returns true if a user is logged in
  }

  // Returns the current logged-in user
  getCurrentUser() {
    if (!this.user) {
      throw new Error("No user is currently logged in.");
    }
    return this.user; // Returns the current user object
  }

  // Sign up a new user and save their data to Firestore
  async signup(email, password, userData) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Choose the collection based on user role
    const userDoc = userData.role === "admin"
      ? doc(db, "admins", user.uid)
      : doc(db, "users", user.uid);

    // Save user data to Firestore
    await setDoc(userDoc, { ...userData, email });
    return user;
  }

  // Sign in an existing user
  async signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    this.user = userCredential.user;
    
    // Fetch user profile after sign-in to get role
    const profile = await this.getUserProfile();
    this.user.role = profile?.role; // Store role in user object

    return this.user;
  }

  // Logout the current user
  async logout() {
    await signOut(auth);
    this.user = null;
  }

  // Get the profile of the current user
  async getUserProfile() {
    if (!this.user) throw new Error("No user is logged in.");
    const userDocRef = doc(db, "users", this.user.uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : null;
  }
}

// Export an instance of the AuthService class
const authService = new AuthService();
export default authService;
