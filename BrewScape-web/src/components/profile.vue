<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="nav-brand">BrewScape</div>
      <div class="nav-links">
        <button class="nav-btn" @click="goToCart">Cart</button>
        <button class="nav-btn" @click="goToDashboard">Dashboard</button>
        <button class="nav-btn logout" @click="logout">Logout</button>
      </div>
    </nav>
    <div class="dashboard-content">
      <div class="personal-info">
        <h2>Personal Information</h2>
        <div class="image-container">
          <img :src="profileImage" alt="Profile Image" class="profile-image" />
        </div>
        <div class="info-details">
          <p class="info-item"><strong><span class="highlight">Name:</span></strong> {{ user.name }}</p>
          <p class="info-item"><strong><span class="highlight">Email Address:</span></strong> {{ user.email }}</p>
          <p class="info-item"><strong><span class="highlight">Location:</span></strong> {{ user.location }}</p>
          <p class="info-item"><strong><span class="highlight">Contract Number:</span></strong> {{ user.contractNumber }}</p>
          <div class="info-item-container">
            <div class="info-item-birthday">
              <strong><span class="highlight">Birthday:</span></strong> {{ user.birthday }}
            </div>
            <div class="info-item-gender">
              <strong><span class="highlight">Gender:</span></strong> {{ user.gender }}
            </div>
          </div>
          <button class="edit-profile-button" @click="openEditProfileModal">Edit Profile</button>
        </div>
      </div>

      <div class="purchase-history-section">
        <h2 class="history-title">Purchase History</h2>
        <div class="purchase-history">
          <div class="history-header">
            <div class="history-column">Item</div>
            <div class="history-column">Quantity</div>
            <div class="history-column">Price</div>
            <div class="history-column">Date</div>
          </div>
          <div class="history-content">
            <div v-if="orderHistory.length > 0">
              <div v-for="(order, index) in orderHistory" :key="index" class="history-row">
                <div v-for="(item, itemIndex) in order.items" :key="itemIndex" class="history-item">
                  <div class="history-column">{{ item.name }}</div>
                  <div class="history-column">{{ item.quantity }}</div>
                  <div class="history-column">₱{{ item.price }}</div>
                  <div class="history-column">{{ formatDate(order.date) }}</div>
                </div>
                <div class="order-total">Total: ₱{{ order.total }}</div>
                <div class="row-divider"></div>
              </div>
            </div>
            <div v-else class="no-history">
              No purchase history available
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isEditProfileModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditProfileModal">&times;</span>
        <h2>Edit Profile</h2>
        <form @submit.prevent="updateProfile">
          <label>Name:</label>
          <input type="text" v-model="editedUser.name" required />
          
          <label>Email Address:</label>
          <input type="email" v-model="editedUser.email" required />
          
          <label>Location:</label>
          <input type="text" v-model="editedUser.location" required />
          
          <label>Contract Number:</label>
          <input type="text" v-model="editedUser.contractNumber" required />
          
          <label>Birthday:</label>
          <input type="date" v-model="editedUser.birthday" required />
          
          <label>Gender:</label>
          <select v-model="editedUser.gender" required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import profileImage from '@/assets/gratis-png-noragami-anime-manga-yato-no-kami-youtube-anime-thumbnail.png';
import NavbarComponent from './NavbarComponent.vue';

export default {
  components: {
    NavbarComponent
  },
  data() {
    return {
      profileImage,
      isEditProfileModalOpen: false,
      user: this.getUserProfile(),
      editedUser: {
        name: '',
        email: '',
        location: '',
        contractNumber: '',
        birthday: '',
        gender: ''
      },
      orderHistory: []
    };
  },

  computed: {
    totalSpend() {
      return this.orderHistory.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
      }, 0).toFixed(2) + '₱';
    }
  },

  created() {
    this.loadOrderHistory();
    // Reload orders when returning to profile
    window.addEventListener('focus', this.loadOrderHistory);
  },

  beforeDestroy() {
    window.removeEventListener('focus', this.loadOrderHistory);
  },

  watch: {
    $route: {
      immediate: true,
      handler() {
        this.loadOrderHistory();
      }
    }
  },

  methods: {
    goToDashboard() {
      this.$router.push("/dashboard"); 
    },
    goToCart() {
      this.$router.push("/cart"); 
    },
    logout() {
      localStorage.removeItem("loggedInUserId");
      this.$router.push("/login");
    },
    openEditProfileModal() {
   
      this.editedUser = { ...this.user };
      this.isEditProfileModalOpen = true;
    },
    closeEditProfileModal() {
      this.isEditProfileModalOpen = false;
    },
    updateProfile() {
     
      this.user = { ...this.editedUser };
      localStorage.setItem('userProfile', JSON.stringify(this.user));
      this.closeEditProfileModal(); 
      alert('Profile updated successfully!');
    },

  
    getUserProfile() {
      const storedUserProfile = localStorage.getItem('userProfile');
      return storedUserProfile ? JSON.parse(storedUserProfile) : {
        name: 'John Doe', 
        email: 'john.doe@example.com',
        location: 'Cagayan de Oro',
        contractNumber: '123-456-7890',
        birthday: '1990-01-01',
        gender: 'Male'
      };
    },
    loadOrderHistory() {
      try {
        // Get user profile
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (!userProfile || !userProfile.email) {
          console.warn('User profile not found');
          this.orderHistory = [];
          return;
        }

        // Get all orders
        const allOrders = JSON.parse(localStorage.getItem('allOrders')) || {};
        const userOrders = allOrders[userProfile.email] || [];

        // Sort orders by date (newest first)
        this.orderHistory = userOrders.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        console.log('Loaded orders for user:', userProfile.email);
        console.log('Orders:', this.orderHistory);
      } catch (error) {
        console.error('Error loading orders:', error);
        this.orderHistory = [];
      }
    },

    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return dateString;
      }
    },
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #4d2c16;
  border-radius: 8px;
  margin-bottom: 20px;
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

.dashboard-container {
  min-height: 100vh;
  padding: 40px;
  background-color: #f8e2c2;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  height: 100vh;
}

.dashboard-content {
  display: flex;
  flex: 1;
  position: relative;
}

.personal-info {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center; 
  text-align: left; 
  margin-top: 0; 
  padding-right: 1155px; 
  height: fit-content;
}

.purchase-history-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 0;
  width: 1000px;
  height: fit-content;
}

.history-title {
  color: #4d2c16;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.purchase-history {
  width: 100%;
}

.history-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr;
  background: #4d2c16;
  color: white;
  padding: 10px;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
}

.history-content {
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.history-row {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.history-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr;
  padding: 8px;
  align-items: center;
}

.history-column {
  padding: 8px;
}

.order-total {
  text-align: right;
  padding: 8px;
  font-weight: bold;
  color: #4d2c16;
}

.row-divider {
  height: 1px;
  background: #eee;
  margin: 8px 0;
}

.no-history {
  padding: 20px;
  text-align: center;
  color: #666;
}

.image-container {
  margin-top: 3px; 
}

.profile-image {
  width: 125px; 
  height: 125px; 
  border-radius: 50%; 
  object-fit: cover;
  border: 1px solid #000000; 
}

.info-details {
  margin-top: 20px; 
  font-size: 16px; 
}

.info-item {
  border: 2px solid white;
  border-radius: 30px; 
  padding: 10px; 
  margin: 12px 0;
  background-color: rgba(255, 255, 255, 0.8); 
}

.info-item-container {
  display: flex; 
  justify-content: space-between; 
  width: 100%; 
  margin-top: 12px; 
}

.info-item-birthday {
  border: 2px solid white;
  border-radius: 20px; 
  padding: 8px; 
  margin-right: 12px; 
  background-color: rgba(255, 255, 255, 0.8); 
  flex: 1; 
  font-size: 12px; 
}

.info-item-gender {
  border: 2px solid white; 
  border-radius: 20px; 
  padding: 8px; 
  background-color: rgba(255, 255, 255, 0.8); 
  flex: 1; 
  font-size: 12px;
}

.edit-profile-button {
  margin-top: 20px; 
  background-color: #4b2d1f; 
  color: white;
  padding: 10px 20px;
  border-radius: 8px; 
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4); 
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%; 
  max-width: 500px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* Add styles for the form and input elements */
form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
}

input, select {
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"] {
  background-color: #4b2d1f;
  color: white;
  margin-top: 15px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #3a2115;
}
</style>
