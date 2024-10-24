<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup">
      <label for="email">Email</label>
      <input type="email" v-model="email" id="email" required />

      <label for="password">Password</label>
      <input type="password" v-model="password" id="password" required />

      <button type="submit" :disabled="loading">Sign Up</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { auth } from "@/firebase.config"; // Import the auth instance
import { createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "", // For displaying any signup error
      loading: false, // For disabling the button while loading
    };
  },
  methods: {
    async handleSignup() {
      this.loading = true; // Start loading
      try {
        // Firebase sign-up logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        console.log("User signed up:", user);
        // Redirect or show success message
        this.$router.push("/"); // Redirect to home page after signup
      } catch (error) {
        console.error("Error during signup:", error);
        if (error.code === "auth/email-already-in-use") {
          this.errorMessage =
            "This email is already registered. Try logging in.";
        } else if (error.code === "auth/invalid-email") {
          this.errorMessage = "Please enter a valid email address.";
        } else if (error.code === "auth/weak-password") {
          this.errorMessage = "Password should be at least 6 characters long.";
        } else {
          this.errorMessage = "Signup failed. Please try again.";
        }
      } finally {
        this.loading = false; // Stop loading
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
}

button {
  margin-top: 20px;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

button[disabled] {
  background-color: #ddd;
  cursor: not-allowed;
}

button:hover:not([disabled]) {
  background-color: #368d6e;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
