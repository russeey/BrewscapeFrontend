<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="nav-brand">BrewScape</div>
      <div class="nav-links">
        <button class="nav-btn" @click="goToCart">Cart</button>
        <button class="nav-btn" @click="goToDashboard">Dashboard</button>
        <button class="nav-btn logout" @click="goToDashboard">Back</button>
      </div>
    </nav>

    <!-- Notification Section -->
    <div v-if="showNotification" class="notification">
      <p>{{ notificationMessage }}</p>
    </div>

    <div class="dashboard-content">
      <div class="personal-info" v-if="user">
        <div class="profile-container">
          <h2 style="text-align: center;">Personal Information</h2>
          <div class="image-container">
            <img :src="profilePicture" alt="Profile Image" class="profile-image" />
          </div>
          <div class="info-details">
            <p class="info-item"><strong><span class="highlight">Name:</span></strong> {{ user.name }}</p>
            <p class="info-item"><strong><span class="highlight">Email Address:</span></strong> {{ user.email }}</p>
            <p class="info-item"><strong><span class="highlight">Location:</span></strong> {{ user.location }}</p>
            <p class="info-item"><strong><span class="highlight">Contact Number:</span></strong> {{ user.contractNumber }}</p>
            <div class="info-item-container">
              <div class="info-item-birthday">
                <strong><span class="highlight">Birthday:</span></strong> {{ user.birthday }}
              </div>
              <div class="info-item-gender">
                <strong><span class="highlight">Gender:</span></strong> {{ user.gender }}
              </div>
            </div>
            <div class="button-container">
              <button class="edit-profile-button" @click="openEditProfileModal">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else class="loading">
        <p>Loading user profile...</p>
      </div>

      <!-- Purchase History Section -->
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
            <div v-if="orderHistory && orderHistory.length > 0">
              <div v-for="(order, index) in orderHistory" :key="index" class="history-row">
                <div v-for="(item, itemIndex) in order.items" :key="itemIndex" class="history-item">
                  <div class="history-column">{{ item.name }}</div>
                  <div class="history-column">{{ item.quantity }}</div>
                  <div class="history-column">₱{{ item.price.toFixed(2) }}</div>
                  <div class="history-column">{{ formatDate(order.date) }}</div>
                </div>
                <div class="order-total">Total: ₱{{ order.total.toFixed(2) }}</div>
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

          <label>Contact Number:</label>
          <input type="tel" v-model="editedUser.contractNumber" @input="filterInput" placeholder="Enter your contact number" required />

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
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import NavbarComponent from './NavbarComponent.vue';
import authService from '../services/authService';

export default {
  components: {
    NavbarComponent
  },
  data() {
    return {
      profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      isEditProfileModalOpen: false,
      user: null,
      editedUser: {
        name: '',
        email: '',
        location: '',
        contractNumber: '',
        birthday: '',
        gender: ''
      },
      orderHistory: [], // Stores fetched purchase history
      showNotification: false,
      notificationMessage: '',
    };
  },
  created() {
    this.loadUserProfile();
    this.loadOrderHistory(); // Fetch purchase history when the component is created
  },
  methods: {
    async loadUserProfile() {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.email) return;

      const docRef = doc(getFirestore(), 'users', currentUser.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.user = docSnap.data();
        this.profilePicture = this.user.profilePicture || this.profilePicture;
      }
    },

    async loadOrderHistory() {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.email) return;

        const ordersRef = collection(getFirestore(), 'orders');
        const q = query(ordersRef, where("userEmail", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          this.orderHistory = [];
          console.log("No orders found for this user");
        } else {
          this.orderHistory = querySnapshot.docs.map((doc) => {
            const orderData = doc.data();
            return {
              ...orderData,
              date: orderData.date.toMillis(), // Convert Firestore timestamp to milliseconds
              total: orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0), // Calculate total
            };
          });
          console.log("Orders loaded:", this.orderHistory); // Debugging line
        }
      } catch (error) {
        console.error("Error loading purchase history:", error);
        this.showNotification = true;
        this.notificationMessage = "Error loading purchase history. Please try again later.";
      }
    },

    formatDate(timestamp) {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },

    openEditProfileModal() {
      this.isEditProfileModalOpen = true;
    },

    closeEditProfileModal() {
      this.isEditProfileModalOpen = false;
    },

    updateProfile() {
      // Update profile logic
    },

    filterInput(event) {
      const value = event.target.value.replace(/[^0-9]/g, '');
      event.target.value = value;
    },

    logout() {
      authService.logout(); // Assuming there's a method for logging out
      this.$router.push('/login'); // Navigate to login page
    },
    
    goToCart() {
      this.$router.push('/cart');
    },

    goToDashboard() {
      this.$router.push('/dashboard');
    },
  },
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
  align-items: flex-start; 
  text-align: left; 
  margin-top: 0; 
  padding-right: 0; 
  height: fit-content;
  margin-left: 20px;
}

.profile-container {
  text-align: center; /* Center text for heading and image */
  margin-left: 20px; /* Add some margin for spacing */
}

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 3px solid #4b2d1f;
}

.upload-label {
  cursor: pointer;
  padding: 8px 16px;
  background-color: #4b2d1f;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.upload-label:hover {
  background-color: #6b4d3f;
}

.info-details {
  margin-top: 20px; 
  font-size: 16px; 
  text-align: left; /* Align user details to the left */
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

.button-container {
  text-align: center; /* Center the button */
  margin-top: 20px;
}

.edit-profile-button {
  margin-top: 20px; 
  background-color: #4b2d1f; 
  color: white;
  padding: 10px 20px;
  border-radius: 8px; 
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

.payment-method {
  text-align: right;
  padding: 8px;
  font-weight: bold;
  color: #4d2c16;
}

.payment-details {
  margin-top: 8px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.9em;
}

.payment-details div {
  margin: 4px 0;
  color: #666;
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

.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(75, 45, 31, 0.9);
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.image-container input[type="file"] {
  display: none;
}

.image-container label {
  background-color: #f8e2c2;
  color: rgb(0, 0, 0); /* Change text color to white */
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.image-container label:hover {
  background-color: #f8e2c2;
}
</style>
