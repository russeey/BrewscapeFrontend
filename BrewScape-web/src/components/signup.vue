<template>
  <div class="signup-page">
    <header>
      <div class="navbar">
        <div class="logo-section">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <span>BrewScape</span>
        </div>
      </div>
    </header>
    <div class="signup-form-container">
      <h1>Create an account</h1>

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
        <div v-if="role === 'user'">
          <input
            type="text"
            v-model="phoneNumber"
            placeholder="Phone Number"
            required
          />
          <input
            type="text"
            v-model="location"
            placeholder="Location"
            required
          />
        </div>
        <input
          type="password"
          v-model="password"
          placeholder="Password"
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
        <label for="role">Select Role:</label>
        <select v-model="role" required>
          <option value="" disabled>Select your role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>

        <!-- Owner-specific fields -->
        <div v-if="role === 'owner'">
          <input
            type="password"
            v-model="ownerPasskey"
            placeholder="Enter Owner Passkey"
            required
          />
        </div>

        <div v-if="role === 'admin'">
          <input
            type="password"
            v-model="secretPasskey"
            placeholder="Secret Passkey"
            required
          />
        </div>

        <p class="policy-text">
          By clicking Sign Up, you agree to our
          <a href="#">Terms</a>, <a href="#">Privacy Policy</a>, and
          <a href="#">Cookies Policy</a>.
        </p>
        <button type="submit" :disabled="loading">Sign Up</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase.config';

export default {
  name: 'SignUpPage',
  setup() {
    const router = useRouter();
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const phoneNumber = ref('');
    const location = ref('');
    const password = ref('');
    const gender = ref('');
    const birthday = ref('');
    const role = ref('user');
    const ownerPasskey = ref('');
    const secretPasskey = ref('');
    const loading = ref(false);
    const errorMessage = ref('');

    const handleSignup = async () => {
      if (loading.value) return;

      loading.value = true;
      errorMessage.value = '';

      try {
        // Create user using Firebase Authentication
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        const user = userCredential.user;

        // Prepare user data based on role
        const userData = {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phoneNumber: phoneNumber.value,
          location: location.value,
          gender: gender.value,
          birthday: birthday.value,
          role: role.value,
        };

        if (role.value === 'user') {
          // Add user-specific fields
          userData.phoneNumber = phoneNumber.value;
          userData.location = location.value;
        } else if (role.value === 'admin') {
          // Validate admin passkey
          if (secretPasskey.value !== 'Shadowaxe') {
            throw new Error('Invalid passkey for admin role');
          }
          userData.secretPasskey = secretPasskey.value;
        } else if (role.value === 'owner') {
          // Validate owner passkey
          const validOwnerPasskey = 'OwnerPasskey123'; // Define your secure passkey
          if (ownerPasskey.value !== validOwnerPasskey) {
            throw new Error('Invalid passkey for owner role');
          }
          userData.ownerPasskey = ownerPasskey.value;
        }

        // Store user data in Firestore under the appropriate collection
        await setDoc(doc(db, role.value === 'owner' ? 'owners' : role.value === 'admin' ? 'admins' : 'users', user.uid), userData);
        router.push(role.value === 'owner' ? '/owner-dashboard' : role.value === 'admin' ? '/admin-dashboard' : '/dashboard');
      } catch (error) {
        errorMessage.value = error.message;
      } finally {
        loading.value = false;
      }
    };

    return {
      firstName,
      lastName,
      email,
      phoneNumber,
      location,
      password,
      gender,
      birthday,
      role,
      ownerPasskey,
      secretPasskey,
      loading,
      errorMessage,
      handleSignup,
    };
  },
};
</script>



<style scoped>
.signup-page {
  background-image: url(https://image.slidesdocs.com/responsive-images/background/coffee-culture-illustration-powerpoint-background_e224109f77__960_540.jpg);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 110vh;
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
