<template>
  <nav class="navbar">
    <div class="nav-brand">BrewScape</div>
    <div class="nav-links">
      <button class="nav-btn" @click="goToCart">Cart</button>
      <button class="nav-btn" @click="goToProfile">Profile</button>
      <button class="nav-btn logout" @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'HeaderComponent',
  methods: {
    goToProfile() {
      this.$emit('go-to-profile');
    },
    goToCart() {
      this.$emit('go-to-cart');
    },
    logout() {
      this.$emit('logout');
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #4d2c16;
  margin-bottom: 0;
  border-radius: 8px;
  border-bottom: 1px solid #ccc;
}

.nav-brand {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-btn.logout {
  background-color: #bd8e50;
}

.nav-btn.logout:hover {
  background-color: #a67b43;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
