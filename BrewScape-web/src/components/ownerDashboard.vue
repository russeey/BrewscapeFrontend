<template>
  <div class="dashboard-page">
    <header>
      <div class="navbar">
        <div class="logo-section">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <span>BrewScape - Owner Dashboard</span>
        </div>
      </div>
    </header>
    <div class="content-container">
      <h2>Welcome to the Owner Dashboard</h2>
      <p>Here you can manage your coffee shop operations.</p>
      <!-- Add more dashboard content here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ownerDashboard',
};
</script>

<style scoped>
.dashboard-page {
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

.content-container {
  background-color: #fbe5c7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  text-align: center;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #4d2c16;
}
</style>
