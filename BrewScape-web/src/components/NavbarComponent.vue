<template>
  <header class="navbar">
    <div class="navbar-brand">
      <h1>BrewScape</h1>
    </div>
    <div class="navbar-buttons">
      <button v-if="showCart" class="nav-button" @click="goToCart">
        <i class="fas fa-shopping-cart"></i> Cart
      </button>
      <button v-if="showDashboard" class="nav-button" @click="goToDashboard">
        <i class="fas fa-home"></i> Dashboard
      </button>
      <button v-if="showProfile" class="nav-button" @click="goToProfile">
        <i class="fas fa-user"></i> Profile
      </button>
      <button class="nav-button" @click="logout">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </header>
</template>

<script>
import { useRouter } from 'vue-router';
import authService from '../services/authService';

export default {
  name: 'NavbarComponent',
  props: {
    showCart: {
      type: Boolean,
      default: true
    },
    showDashboard: {
      type: Boolean,
      default: true
    },
    showProfile: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const router = useRouter();

    const goToCart = () => {
      router.push('/cart');
    };

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    const goToProfile = () => {
      router.push('/profile');
    };

    const logout = async () => {
      try {
        await authService.logout();
        router.push('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    return {
      goToCart,
      goToDashboard,
      goToProfile,
      logout
    };
  }
};
</script>

<style scoped>
.navbar {
  background-color: #4d2c16;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #bd8e50;
}

.navbar-buttons {
  display: flex;
  gap: 1rem;
}

.nav-button {
  background-color: transparent;
  border: none;
  color: #bd8e50;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.nav-button:hover {
  color: white;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .navbar-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>
