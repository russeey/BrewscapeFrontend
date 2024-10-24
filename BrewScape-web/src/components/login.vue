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
        <button type="submit">Login</button>
      </form>
      <p>JOIN US AND EXPLORE LOCAL COFFEE SHOP HERE<br><span>IN CDO</span></p>
      <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async loginUser() {
        try {
          const auth = getAuth();
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          console.log('User logged in:', userCredential.user);
          // Redirect to the homepage after successful login
          this.$router.push('/');
        } catch (error) {
          console.error('Error logging in:', error);
          alert('Login failed. Please check your credentials.');
        }
      }
    }
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
  
  button:hover {
    background-color: #45a049;
  }
  
  p {
    margin-top: 15px;
    font-size: 16px;
  }
  </style>
  