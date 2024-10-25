<template>
    <div>
      <header>
        <div class="header">
          <h1>BrewScape</h1>
          <nav>
            <a href="home.html">Home</a>
            <a href="cart.html">Cart</a>
            <a href="profile.html">Profile</a>
          </nav>
        </div>
      </header>
  
      <main class="profile-container">
        <section class="profile-card">
          <h2>Personal Information</h2>
          <div class="avatar">
            <img src="https://via.placeholder.com/150" alt="Profile Avatar" id="profile-avatar" />
          </div>
          <div id="profile-info">
            <div class="info-item" v-for="(value, key) in userData" :key="key">
              <p><strong>{{ key.replace(/^\w/, c => c.toUpperCase()) }}:</strong> {{ value || 'N/A' }}</p>
            </div>
            <button @click="openEditProfileModal">Edit Profile</button>
          </div>
        </section>
  
        <section class="purchase-history-card">
          <h2>Purchase History</h2>
          <table id="purchase-history">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Store</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody id="purchase-history-content">
              <tr v-for="(purchase, index) in purchaseHistory" :key="index">
                <td>{{ purchase.item || 'N/A' }}</td>
                <td>₱ {{ purchase.price ? purchase.price.toFixed(2) : 'N/A' }}</td>
                <td>BrewScape</td>
                <td>{{ purchase.date || 'N/A' }}</td>
              </tr>
              <tr v-if="!purchaseHistory.length">
                <td colspan="4" class="no-purchases">No purchase history found.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"></td>
                <td id="total-price" colspan="1"><strong>Total Spend:</strong> ₱ {{ totalPrice.toFixed(2) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </section>
  
        <div v-if="isModalOpen" class="modal">
          <div class="modal-content">
            <span @click="closeEditProfileModal" class="close">&times;</span>
            <h2 class="modal-heading">Edit Profile</h2>
            <div class="form-group" v-for="(value, key) in userData" :key="key">
              <label :for="key">{{ key.replace(/^\w/, c => c.toUpperCase()) }}:</label>
              <input :id="key" v-model="userData[key]" :type="key === 'email' ? 'email' : 'text'" />
            </div>
            <button @click="saveProfileChanges">Save Changes</button>
          </div>
        </div>
  
        <div v-if="notification" class="notification">{{ notification }}</div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userData: {},
        purchaseHistory: [],
        totalPrice: 0,
        isModalOpen: false,
        notification: null,
      };
    },
    created() {
      this.loadUserData();
      this.loadPurchaseHistory();
    },
    methods: {
      loadUserData() {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        const users = JSON.parse(localStorage.getItem("users")) || [];
        this.userData = users.find(user => user.id === parseInt(loggedInUserId)) || {};
      },
      loadPurchaseHistory() {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        this.purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${loggedInUserId}`)) || [];
        this.totalPrice = this.purchaseHistory.reduce((sum, purchase) => sum + (purchase.price || 0), 0);
      },
      openEditProfileModal() {
        this.isModalOpen = true;
      },
      closeEditProfileModal() {
        this.isModalOpen = false;
      },
      saveProfileChanges() {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(user => user.id === parseInt(loggedInUserId));
        if (userIndex !== -1) {
          users[userIndex] = { id: parseInt(loggedInUserId), ...this.userData };
          localStorage.setItem("users", JSON.stringify(users));
          this.showNotification("Profile successfully updated!");
          this.isModalOpen = false;
        }
      },
      showNotification(message) {
        this.notification = message;
        setTimeout(() => {
          this.notification = null;
        }, 3000);
      },
    },
  };
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
    background-color: #f5e1c8;
  }
  
  .header {
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  nav a {
    color: rgb(0, 0, 0);
    margin: 0 10px;
    text-decoration: none;
  }
  
  .profile-container {
    display: flex;
    padding: 20px;
  }
  
  .profile-card, .purchase-history-card {
    text-align: center;
  }
  
  #profile-info {
    margin-top: 10px;
  }
  
  table {
    width: 100%;
    margin-top: 10px;
  }
  
  th, td {
    padding: 10px;
    text-align: center;
    background-color: #fff;
  }
  
  .no-purchases {
    color: #888;
  }
  
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4caf50;
    color: white;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
  