<template>
  <div v-if="isAuthenticated" class="cart-page dashboard-container">
    <nav class="navbar">
      <div class="nav-brand">BrewScape</div>
      <div class="nav-links">
        <button class="nav-btn" @click="goToDashboard">
          <i class="fas fa-home"></i> Dashboard
        </button>
        <button class="nav-btn" @click="goToProfile">
          <i class="fas fa-user"></i> Profile
        </button>
        <button class="nav-btn logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </nav>

    <section class="cart-content">
      <h2>Order</h2>
      <div class="order-header">
        <div class="column">
          <span>ORDER</span>
        </div>
        <div class="column quantity-column">
          <span>QUANTITY</span>
        </div>
        <div class="column">
          <span>PRICE</span>
        </div>
      </div>
      <ul v-if="cartItems.length > 0" class="order-list">
        <li v-for="(item, index) in cartItems" :key="index" class="order-item">
          <div class="column">
            <span class="item-name">{{ item.name }}</span>
          </div>
          <div class="column quantity-column">
            <div class="quantity-controls">
              <button class="quantity-btn" @click="decreaseQuantity(index)">-</button>
              <span class="quantity-value">{{ item.quantity }}</span>
              <button class="quantity-btn" @click="increaseQuantity(index)">+</button>
              <button class="remove-btn" @click="removeItem(index)">Remove</button>
            </div>
          </div>
          <div class="column">
            <span class="item-price">{{ item.price }}₱</span>
          </div>
        </li>
      </ul>
      <div v-if="cartItems.length > 0" class="total-section">
        <span>Total</span>
        <span>{{ cartTotal }}₱</span>
      </div>
      <button v-if="cartItems.length > 0" class="payment-button" @click="openPaymentOptions">Review your payment method</button>
      <p v-else>Your cart is currently empty.</p>

      <!-- Gcash Payment Form -->
      <div v-if="selectedPayment === 'Gcash'" class="gcash-form">
        <h3>Gcash Payment</h3>
        <form @submit.prevent="submitGcashPayment">
          <div>
            <label for="gcash-name">Name</label>
            <input type="text" id="gcash-name" v-model="gcashDetails.name" required />
          </div>
          <div>
            <label for="gcash-number">Gcash Number</label>
            <input 
              type="text" 
              id="gcash-number" 
              v-model="gcashDetails.number" 
              required 
              pattern="\d*" 
              @input="validateGcashNumber" 
              title="Only numbers are allowed" />
          </div>

          <div>
            <label for="gcash-pin">Gcash PIN</label>
            <input 
              type="password" 
              id="gcash-pin" 
              v-model="gcashDetails.pin" 
              required 
              pattern="\d{4}" 
              maxlength="4" 
              title="Please enter a 4-digit PIN" 
              @input="validateGcashPin" 
            />
          </div>
          <div>
            <label for="gcash-amount">Amount</label>
            <input type="text" id="gcash-amount" v-model="gcashDetails.amount" readonly />
          </div>
          <button type="submit" class="submit-payment-button">Submit Payment</button>
        </form>
        <!-- Cancel Button to go back to the cart -->
        <button class="cancel-payment-button" @click="cancelPayment">Cancel</button>
      </div>
    </section>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="payment-modal">
      <div class="modal-content">
        <h3>Choose Your Payment Method</h3>
        <div class="payment-options">
          <button class="payment-option" @click="selectPayment('Gcash')">Gcash Payment</button>
          <button class="payment-option" @click="selectPayment('Cash on Delivery')">Cash on Delivery</button>
        </div>
        <button class="close-button" @click="closePaymentModal">Cancel</button>
      </div>
    </div>
  </div>

  <div v-else>
    <h1>You are not authorized to view this page.</h1>
    <router-link to="/login">Go to Login</router-link>
  </div>
</template>

<script>
import authService from "@/authService";

export default {
  data() {
  return {
    isAuthenticated: false,
    cartItems: [],
    showPaymentModal: false,
    selectedPayment: null,
    gcashDetails: {
      name: "",
      number: "",
      pin: "",
      amount: ""
    },
    showSuccessMessage: false,
    successMessage: ''
  };
},
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
  },
  created() {
    this.isAuthenticated = authService.isAuthenticated;

    if (!this.isAuthenticated) {
      this.$router.push("/login");
    } else {
      // Load cart items from localStorage
      this.loadCartItems();
    }
  },
  methods: {
    loadCartItems() {
      const items = localStorage.getItem('cartItems');
      this.cartItems = items ? JSON.parse(items) : [];
    },
    increaseQuantity(index) {
      this.cartItems[index].quantity += 1;
      this.updateLocalStorage();
    },
    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity -= 1;
        this.updateLocalStorage();
      }
    },
    removeItem(index) {
      this.cartItems.splice(index, 1);
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    },
    validateGcashNumber() {
      // Remove any non-numeric characters from the input
      this.gcashDetails.number = this.gcashDetails.number.replace(/[^0-9]/g, '');
    },

    validateGcashPin() {
      this.gcashDetails.pin = this.gcashDetails.pin.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      if (this.gcashDetails.pin.length > 4) {
        this.gcashDetails.pin = this.gcashDetails.pin.substring(0, 4); // Limit to 4 digits
      }
    },
  
    goToDashboard() {
      this.$router.push("/dashboard");
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    logout() {
      localStorage.removeItem("loggedInUserId");
      this.$router.push("/login");
    },
    openPaymentOptions() {
      this.showPaymentModal = true;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
    },
    selectPayment(method) {
      this.selectedPayment = method;
      if (method === "Gcash") {
        this.gcashDetails.amount = this.cartTotal;
      }
      this.showPaymentModal = false;
    },
    async saveOrderToHistory() {
      try {
        // Get user info from localStorage
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (!userProfile || !userProfile.email) {
          console.error('User profile not found');
          return;
        }

        const order = {
          items: this.cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: this.cartTotal,
          date: new Date().toISOString()
        };

        // Get existing orders
        let allOrders = JSON.parse(localStorage.getItem('allOrders')) || {};
        if (!allOrders[userProfile.email]) {
          allOrders[userProfile.email] = [];
        }

        // Add new order
        allOrders[userProfile.email].push(order);

        // Save updated orders
        localStorage.setItem('allOrders', JSON.stringify(allOrders));
        console.log('Order saved successfully for user:', userProfile.email);
      } catch (error) {
        console.error('Error saving order:', error);
      }
    },

    async submitGcashPayment() {
      if (this.cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      try {
        await this.saveOrderToHistory();
        this.clearCart();
        alert('Payment Successful! Your order has been recorded.');
        this.gcashDetails = { name: "", number: "", pin: "", amount: "" };
        this.selectedPayment = null;
        this.$router.push('/profile');
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('There was an error processing your payment. Please try again.');
      }
    },
    clearCart() {
      this.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    cancelPayment() {
      this.selectedPayment = null; // Reset the selected payment method
      this.showPaymentModal = false; // Close the payment modal
    }
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
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.cart-content {
  margin-top: 40px;
  padding: 20px;
  background-color: #f3cea2;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
}

.cart-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.order-header,
.order-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  padding: 10px 20px;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.order-header {
  font-weight: bold;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  width: 100%;
}

.quantity-value {
  min-width: 24px;
  text-align: center;
  font-weight: 500;
  margin: 0 4px;
}

.quantity-btn {
  background-color: #4b2d1f;
  color: white;
  border: none;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.remove-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.remove-btn:hover {
  background-color: #c0392b;
}

.quantity-btn:hover {
  opacity: 0.9;
}

.column {
  display: flex;
  align-items: center;
}

.quantity-column {
  justify-content: flex-start;
  position: relative;
}

.column:last-child {
  justify-content: flex-end;
}

.item-name {
  font-weight: 500;
}

.item-price {
  font-weight: 500;
}

.total-section {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-top: 20px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}

.payment-button {
  background-color: #4b2d1f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  margin: 20px auto 0;
  display: block;
  cursor: pointer;
}

.gcash-form {
  margin-top: 20px;
  padding: 20px;
  background-color: #f3cea2;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; 
}

.gcash-form h3 {
  text-align: center;
  margin-bottom: 15px;
}

.gcash-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px; 
}

.gcash-form label {
  font-size: 16px;
  font-weight: 600;
  text-align: left;
}

.gcash-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%; 
}

.submit-payment-button {
  background-color: #4b2d1f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
}

.cancel-payment-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
}

.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.payment-options {
  margin-top: 20px;
}

.payment-option {
  background-color: #4b2d1f;
  color: white;
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
}

.close-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  width: 100%;
  cursor: pointer;
}
</style>
