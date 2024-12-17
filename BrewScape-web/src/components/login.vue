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
      <h2>Sign in</h2>
      <form @submit.prevent="loginUser">
        <input
          type="email"
          v-model="email"
          placeholder="Email"
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
        
        <div class="role-selection">
          <label>Select Role</label>
          <select v-model="role" required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        <button type="submit" :disabled="loading || isLockedOut">Sign In</button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="isLockedOut" class="error">
        Please wait {{ countdown }} seconds before trying again.
      </p>

      <div class="login-section">
        <p>JOIN US AND EXPLORE LOCAL COFFEE SHOPS IN CDO</p>
        <router-link to="/signup" class="join-now-btn">Join now</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.config';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const role = ref('user'); // default role
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
        // Firebase authentication
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Query Firestore based on selected role
        let userRoleRef;
        if (role.value === 'admin') {
          userRoleRef = collection(db, 'admins');
        } else if (role.value === 'owner') {
          userRoleRef = collection(db, 'owners');
        } else {
          userRoleRef = collection(db, 'users');
        }

        const q = query(userRoleRef, where('email', '==', email.value));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No account found with the given email for this role.');
        }

        // Redirect to corresponding dashboard based on role
        if (role.value === 'admin') {
          router.push('/admin-dashboard');
        } else if (role.value === 'owner') {
          router.push('/owner-dashboard');
        } else {
          router.push('/dashboard');
        }

        // Reset login attempts after successful login
        loginAttempts.value = 0;
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

      errorMessage.value = error.message === 'Invalid credentials'
        ? 'Incorrect email or password'
        : error.message;
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
      role,
      loading,
      errorMessage,
      isLockedOut,
      countdown,
      loginUser,
    };
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

.login-section {
  margin-top: 20px;
  color: #4d2c16;
}

.login-section span {
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

.owner-link {
  margin-top: 10px;
  font-size: 14px;
  color: #4d2c16;
  background-color: #fbe5c7;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.owner-link:hover {
  background-color: #4d2c16;
  color: white;
}
</style>