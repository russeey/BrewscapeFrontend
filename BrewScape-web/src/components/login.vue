<template>
  <div class="login-page">
    <header>
      <div class="navbar">
        <div class="logo-section">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <span>BrewScape</span>
        </div>
      </div>
    </header>
    <div class="form-container">
      <h2>Sign in or Create an account</h2>
      <form @submit.prevent="loginUser">
        <input
          type="email"
          v-model="email"
          placeholder="Email or Phone Number"
          required
          :disabled="isLockedOut"
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          :disabled="isLockedOut"
        />
        <div class="check-box-div">
          <div class="checkbox-container">
            <input
              type="checkbox"
              id="keep-signed-in"
              class="checkbox"
              v-model="keepSignedIn"
              :disabled="isLockedOut"
            />
            <label for="keep-signed-in">Keep me signed in</label>
          </div>
          <a href="#">Forgot Username?</a>
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" :disabled="loading || isLockedOut">
          Sign In
        </button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="isLockedOut" class="error">
        Please wait {{ countdown }} seconds before trying again.
      </p>
      <div class="signup-section">
        <p>
          JOIN US AND EXPLORE LOCAL COFFEE SHOP HERE<br /><span>IN CDO</span>
        </p>
        <router-link to="/signup" class="join-now-btn">Join now</router-link>
      </div>
      <p class="admin-link" @click="loginAsAdmin">Sign in as coffee shop administrator</p>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase.config"; // Import Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth";
import authService from "@/authService"; // Import the auth service

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      loading: false,
      keepSignedIn: false,
      failedAttempts: 0,
      maxAttempts: 3,
      timeoutMinutes: 5,
      isLockedOut: false,
      countdown: 30, // 30 seconds countdown
      countdownInterval: null, // Interval ID for countdown
    };
  },
  methods: {
    async loginUser() {
      const currentTimestamp = new Date().getTime();
      const timeoutEndTimestamp = localStorage.getItem("timeoutEndTimestamp");

      // Check if timeout period is active
      if (timeoutEndTimestamp && currentTimestamp < timeoutEndTimestamp) {
        this.startCountdown();
        return;
      }

      this.loading = true; // Show loading state
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        // Set authentication status in authService
        authService.isAuthenticated = true;

        // Reset failed attempts on successful login
        this.failedAttempts = 0;
        localStorage.removeItem("failedAttempts");
        localStorage.removeItem("timeoutEndTimestamp");

        // Save user to localStorage if 'Keep me signed in' is checked
        if (this.keepSignedIn) {
          localStorage.setItem("loggedInUserId", user.uid);
          localStorage.setItem("email", this.email);
        }

        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        this.handleLoginError(error);
      } finally {
        this.loading = false; 
      }
    },
    handleLoginError(error) {
      
      if (error.code === "auth/invalid-email") {
        this.errorMessage = "Invalid email format.";
      } else if (error.code === "auth/user-not-found") {
        this.errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        this.errorMessage = "Incorrect password. Please try again.";
      } else {
        this.errorMessage = "Invalid Username or Password.";
      }

      // Increment failed attempts
      this.failedAttempts += 1;
      localStorage.setItem("failedAttempts", this.failedAttempts);

      if (this.failedAttempts >= this.maxAttempts) {
        const timeoutEndTimestamp = new Date().getTime() + 30 * 1000;
        localStorage.setItem("timeoutEndTimestamp", timeoutEndTimestamp);
        this.isLockedOut = true;
        this.startCountdown(); // Start countdown when locked out
        this.errorMessage = "Too many failed attempts.";
      }
    },
    startCountdown() {
      // Calculate remaining time if returning within timeout
      const timeoutEndTimestamp = localStorage.getItem("timeoutEndTimestamp");
      if (timeoutEndTimestamp) {
        const remainingTime = Math.ceil(
          (timeoutEndTimestamp - new Date().getTime()) / 1000
        );
        this.countdown = remainingTime > 0 ? remainingTime : 0;
      }

      if (this.countdownInterval) clearInterval(this.countdownInterval);

      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown -= 1;
        } else {
          this.resetLockout();
        }
      }, 1000);
    },
    resetLockout() {
      this.isLockedOut = false;
      this.countdown = 30;
      clearInterval(this.countdownInterval);
      localStorage.removeItem("timeoutEndTimestamp");
      localStorage.removeItem("failedAttempts");

      this.errorMessage = "";
    },
  },

  created() {
    const storedAttempts = localStorage.getItem("failedAttempts");
    this.failedAttempts = storedAttempts ? parseInt(storedAttempts) : 0;


    const timeoutEndTimestamp = localStorage.getItem("timeoutEndTimestamp");
    if (timeoutEndTimestamp && new Date().getTime() < timeoutEndTimestamp) {
      this.isLockedOut = true;
      this.startCountdown();
    }
  },
  beforeDestroy() {

    if (this.countdownInterval) clearInterval(this.countdownInterval);
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
  gap: 15px; 
}
.logo-section .logo {
  width: 30px; 
  height: auto;
}

.logo-section span {
  font-size: 1.2rem;
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

.checkbox {
  width: 20px;
}

.check-box-div {
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