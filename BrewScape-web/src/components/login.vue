<template>
  <div class="login-page">
    <header>
      <div class="navbar">
        <div class="logo-section">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <span>BrewScape</span>
          <ul class="nav-links-left">
            <!-- <li><a href="#about-us">About Us</a></li>
            <li><a href="#business-partners">For Business Partners</a></li> -->
          </ul>
        </div>
      </div>
    </header>
    <div class="form-container">
      <h2>Sign in or Create an account</h2>
      <!-- <div class="logo">
        <img :src="logo" alt="coffee logo" width="150" />
      </div> -->
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
        <div class="check-box-div">
            <div class="checkbox-container">
            <input type="checkbox" id="keep-signed-in" class="checkbox" v-model="keepSignedIn" />
            <label for="keep-signed-in">Keep me signed in</label>
          </div>
          <a href="#">Forgot Username?</a>
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" :disabled="loading">Sign In</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div class="signup-section">
        <p>JOIN US AND EXPLORE LOCAL COFFEE SHOP HERE<br /><span>IN CDO</span></p>
        <router-link to="/signup" class="join-now-btn">Join now</router-link>
      </div>
      <p class="admin-link" @click="loginAsAdmin">Sign in as coffee shop administrator</p>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase.config"; // Import Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "", // Error handling
      loading: false, // Loading state
      keepSignedIn: false, // Keep me signed in checkbox
      logo: "14aed144-08e8-4eed-90ce-8b8fb7daa5ec.jpg", // Logo source
    };
  },
  methods: {
    async loginUser() {
      this.loading = true; // Show loading state
      try {
        // Firebase sign-in method
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        // Save user to localStorage if 'Keep me signed in' is checked
        if (this.keepSignedIn) {
          localStorage.setItem("loggedInUserId", user.uid);
          localStorage.setItem("email", this.email);
        }

        // Check if user is admin
        const isAdmin = this.email.includes("admin");
        if (isAdmin) {
          this.$router.push("/adminDashboard"); // Redirect admin
        } else {
          this.$router.push("/"); // Redirect regular user
        }
      } catch (error) {
        console.error("Login error:", error);
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
        this.loading = false; // Stop loading state
      }
    },
    loginAsAdmin() {
      this.email = "admin@example.com";
      this.password = "adminpassword"; // Set default admin credentials
    },
  },
};
</script>

<style scoped>
.login-page {
  background-image: url(https://image.slidesdocs.com/responsive-images/background/coffee-culture-illustration-powerpoint-background_e224109f77__960_540.jpg);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
  margin: 0;
  padding: 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  background-color: #f5e6d1;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px; /* Reduced gap between logo and text */
}
.logo-section .logo {
  width: 30px; /* Reduced logo size */
  height: auto;
}

.logo-section span {
  font-size: 1.2rem; /* Reduced font size for compact design */
  font-weight: bold;
  color: #4b2d1f;
}

.form-container {
  background-color: #fbe5c7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 320px;
  text-align: center;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #4d2c16;
}

.checkbox{
  width: 20px;
}

.check-box-div{
  display: flex;
  align-items: start;
  flex-direction: column;
}
input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4d2c16;
  justify-content: start;
  margin-bottom: 10px;
  width: 100%;
}

.checkbox-container label {
  margin-left: 0%;
  width: 100%;
  text-align: start;
}

a {
  display: block;
  margin: 5px 0;
  color: #4d2c16;
  text-decoration: underline;
  font-size: 14px;
}

button {
  padding: 10px;
  width: 100%;
  background-color: #fbe5c7;
  color: #4d2c16;
  border-radius: 5px;
  cursor: pointer;
}

button[disabled] {
  background-color: #ddd;
  cursor: not-allowed;
}

button:hover:not([disabled]) {
  background-color: #ffffff;
}

.signup-section {
  margin-top: 20px;
  color: #4d2c16;
}

.signup-section span {
  font-weight: bold;
}

.join-now-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 20px;
  background-color: #4d2c16;
  color: white;
  border-radius: 20px;
  text-decoration: none;
}

.error {
  color: red;
  margin-top: 10px;
}

.admin-link {
  margin-top: 10px;
  font-size: 14px;
  color: #4d2c16;
  text-decoration: underline;
  cursor: pointer;
}
</style>
