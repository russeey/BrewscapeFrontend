<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <nav>
        <router-link to="/admin-users">Manage Users</router-link>
        <router-link to="/admin-reports">View Reports</router-link>
        <router-link to="/admin-settings">Settings</router-link>
      </nav>
    </header>
    <main class="dashboard-content">
      <section>
        <h2>Welcome, Administrator!</h2>
        <p>This is your dashboard where you can manage the application.</p>
      </section>
      <section>
        <h3>Statistics</h3>
        <p>Here you can view various statistics related to the application.</p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'admin-dashboard',
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f5f5;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4b2d1f;
  color: white;
  padding: 10px;
}

.dashboard-content {
  margin-top: 20px;
}

nav a {
  margin-right: 15px;
  color: #4b2d1f;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
</style>
