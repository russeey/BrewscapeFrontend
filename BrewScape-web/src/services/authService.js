import { auth, db } from "@/firebase.config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

class AuthService {
  constructor() {
    this.user = null;
    this.listenForAuthChanges();
  }

  listenForAuthChanges() {
    onAuthStateChanged(auth, (user) => {
      this.user = user; // Updates the current user when auth state changes
      console.log("Auth state updated:", user);
    });
  }

  isAuthenticated() {
    return !!this.user; // Returns true if a user is logged in
  }

  getCurrentUser() {
    if (!this.user) {
      throw new Error("No user is currently logged in.");
    }
    return this.user; // Returns the current user object
  }

  async signup(email, password, userData) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = userData.role === "admin"
      ? doc(db, "admins", user.uid)
      : doc(db, "users", user.uid);

    await setDoc(userDoc, { ...userData, email });
    return user;
  }

  async signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    this.user = userCredential.user;
    return this.user;
  }

  async logout() {
    await signOut(auth);
    this.user = null;
  }

  async getUserProfile() {
    if (!this.user) throw new Error("No user is logged in.");
    const userDocRef = doc(db, "users", this.user.uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : null;
  }
}

const authService = new AuthService();
export default authService;
