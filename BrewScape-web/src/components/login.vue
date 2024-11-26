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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const keepSignedIn = ref(false);
    const loading = ref(false);
    const errorMessage = ref('');
    const loginAttempts = ref(0);
    const isLockedOut = ref(false);
    const countdown = ref(0);
    let countdownTimer = null;

    const loginUser = async () => {
      if (isLockedOut.value) return;
      
      loading.value = true;
      errorMessage.value = '';
      
      try {
        await authService.login(email.value, password.value, keepSignedIn.value);
        router.push('/dashboard');
      } catch (error) {
        handleLoginError(error);
      } finally {
        loading.value = false;
      }
    };

    const handleLoginError = (error) => {
      loginAttempts.value++;
      
      if (loginAttempts.value >= 3) {
        isLockedOut.value = true;
        startCountdown();
      }
      
      // Replace Firebase error with a generic message
      errorMessage.value = error.code === 'auth/invalid-credential' 
        ? 'Incorrect username or password' 
        : 'An error occurred during login';
    };

    const startCountdown = () => {
      countdown.value = 30;
      countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          resetLockout();
        }
      }, 1000);
    };

    const resetLockout = () => {
      clearInterval(countdownTimer);
      isLockedOut.value = false;
      loginAttempts.value = 0;
      countdown.value = 0;
    };

    return {
      email,
      password,
      keepSignedIn,
      loading,
      errorMessage,
      isLockedOut,
      countdown,
      loginUser,
      handleLoginError
    };
  }
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
  color: #000000;
  border-radius: 5px;
  cursor: pointer;
}

button[disabled] {
  background-color: #ddd;
  cursor: not-allowed;
}

button:hover:not([disabled]) {
  background-color: #4d2c16;
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