<template>
  <header class="header">
    <div class="logo">
      <h1>BrewScape</h1>
    </div>
    <button class="cart-button" @click="goToCart">Cart</button>
    <button class="profile-button" @click="goToProfile">Profile</button>
    <button class="logout-button" @click="logout">Logout</button>
  </header>
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
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #f4f4f4;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  display: flex;
  align-items: center;
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-left: 10px;
}

.logout-button {
  background-color: #4b2d1f;
  color: white;
  margin-left: 20px;
}

.profile-button {
  background-color: #4b2d1f;
  color: white;
  margin-left: 20px;
}

.cart-button {
  background-color: #4b2d1f;
  color: white;
  margin-left: 980px;
}

button {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
