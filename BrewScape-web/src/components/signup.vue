<template>
  <div class="signup-page">
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
    <div class="signup-form-container">
      <h1>Create an account</h1>
      <!-- <div class="logo">
        <img :src="coffeeLogo" alt="coffee logo" width="60" />
      </div> -->
      <form @submit.prevent="handleSignup">
        <div class="name-fields">
          <input
            type="text"
            v-model="firstName"
            placeholder="First Name"
            required
          />
          <input
            type="text"
            v-model="lastName"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          type="email"
          v-model="email"
          placeholder="Email Address"
          required
        />
        <input
          type="text"
          v-model="phoneNumber"
          placeholder="Phone Number"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
        />  
        <input
          type="text"
          v-model="location"
          placeholder="location"
          required
        />
        <div class="birth-gender">
          <input type="date" v-model="birthday" placeholder="Birthday" />
          <select v-model="gender">
            <option disabled value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <p class="policy-text">
          By clicking Sign Up, you agree to our
          <a href="#">Terms</a>, <a href="#">Privacy Policy</a> and
          <a href="#">Cookies Policy</a>.
        </p>
        <button type="submit" :disabled="loading">Sign Up</button>
      </form> 
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase.config"; // Import the auth instance
import { createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      location: "",
      birthday: "",
      gender: "",
      errorMessage: "",
      loading: false,
      coffeeLogo: "@/assets/logo.png", // Path to the coffee logo
    };
  },
  methods: {
    async handleSignup() {
      this.loading = true; // Start loading
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        console.log("User signed up:", user);
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
.signup-page {
  background-image: url(https://image.slidesdocs.com/responsive-images/background/coffee-culture-illustration-powerpoint-background_e224109f77__960_540.jpg);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.signup-form-container {
  background-color: #fbe5c7;
    padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;
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

h1 {
  font-size: 24px;
  color: #4d2c16;
}

.logo img {
  margin-bottom: 15px;
}

.name-fields {
  display: flex;
  gap: 10px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.birth-gender {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 0;
  gap: 10px;
}

button {
  padding: 10px;
  width: 100%;
  background-color: #ffffff;
  color: #4d2c16;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button[disabled] {
  background-color: #ddd;
  cursor: not-allowed;
}

button:hover:not([disabled]) {
  background-color: #f8f8f8;
}

.policy-text {
  font-size: 12px;
  color: #4d2c16;
  margin-top: 15px;
}

.policy-text a {
  color: #4d2c16;
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
  
}
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 50px;
}
</style>
