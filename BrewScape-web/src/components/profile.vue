
<template>
  <div class="profile">
    <h1>User Profile</h1>
    <div class="profile-details">
      <div class="profile-item">
        <label>Username:</label>
        <p>{{ user.username }}</p>
      </div>
      <div class="profile-item">
        <label>Email:</label>
        <p>{{ user.email }}</p>
      </div>
 
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "", 
        email: ""
      }
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      // Replace this with your actual method for retrieving user data
      // For example, from localStorage or an API call
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (storedUser) {
        this.user.username = storedUser.username;
        this.user.email = storedUser.email;
      } else {
        // Example fallback data if no user data is found
        this.user.username = "Guest";
        this.user.email = "guest@example.com";
      }
    }
  }
};
</script>

<style scoped>
.profile {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.profile-details {
  display: flex;
  flex-direction: column;
}

.profile-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
}

.profile-item:last-child {
  border-bottom: none;
}

label {
  font-weight: bold;
  color: #555;
}

p {
  margin: 0;
  color: #666;
  font-size: 16px;
}
</style>
