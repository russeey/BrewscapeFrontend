<template>
  <div class="container">
    <h2>Sign in or Create an account</h2>
    <img :src="logo" alt="Logo" width="150" />
    <form @submit.prevent="loginUser">
      <input
        type="email"
        v-model="email"
        placeholder="Email or Phone Number"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit" :disabled="loading">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>JOIN US AND EXPLORE LOCAL COFFEE SHOP HERE<br /><span>IN CDO</span></p>
    <p>
      Don't have an account? <router-link to="/signup">Sign Up</router-link>
    </p>
  </div>
</template>

<script>
import { auth } from "@/firebase.config"; // Import the auth instance
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "", // For displaying any login error
      loading: false, // For disabling the button while loading
    };
  },
  methods: {
    async loginUser() {
      this.loading = true; // Start loading
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        console.log("User logged in:", userCredential.user);
        this.$router.push("/"); // Redirect to home page after successful login
      } catch (error) {
        console.error("Error logging in:", error);
        if (error.code === "auth/invalid-email") {
          this.errorMessage = "Invalid email format.";
        } else if (error.code === "auth/user-not-found") {
          this.errorMessage = "No user found with this email.";
        } else if (error.code === "auth/wrong-password") {
          this.errorMessage = "Incorrect password. Please try again.";
        } else {
          this.errorMessage = "Login failed. Please try again.";
        }
      } finally {
        this.loading = false; // Stop loading
      }
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
}

h2 {
  font-size: 16px;
}

input {
  width: 300px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 5px 10px;
  background-color: #cea307;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button[disabled] {
  background-color: #ddd;
  cursor: not-allowed;
}

button:hover:not([disabled]) {
  background-color: #45a049;
}

p {
  margin-top: 15px;
  font-size: 16px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
