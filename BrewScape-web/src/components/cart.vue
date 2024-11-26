<template>
  <div>
    <div v-if="isAuthenticated" class="cart-container">
      <div class="cart-page dashboard-container">
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

      <!-- Notification -->
      <transition name="fade">
        <div v-if="showNotification" class="notification">
          {{ notificationMessage }}
        </div>
      </transition>
    </div>

    <div v-else>
      <h1>You are not authorized to view this page.</h1>
      <router-link to="/login">Go to Login</router-link>
    </div>

    <!-- Cash on Delivery Payment Form -->
    <div v-if="selectedPayment === 'Cash on Delivery'" class="gcash-form">
      <h3>Cash on Delivery Details</h3>
      <form @submit.prevent="submitCashOnDeliveryPayment">
        <div>
          <label for="cod-name">Name</label>
          <input 
            type="text" 
            id="cod-name" 
            v-model="codDetails.fullName" 
            required
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label for="cod-contact">Contact Number</label>
          <input 
            type="tel" 
            id="cod-contact" 
            v-model="codDetails.contactNumber" 
            required
            placeholder="Enter your contact number"
            pattern="\d*"
            @input="validateContactNumber"
            title="Only numbers are allowed"
          />
        </div>
        <div>
          <label for="cod-address">Delivery Address</label>
          <textarea 
            id="cod-address" 
            v-model="codDetails.address" 
            required
            placeholder="Enter your complete delivery address"
          ></textarea>
        </div>
        <div>
          <label for="cod-amount">Amount</label>
          <input 
            type="text" 
            id="cod-amount" 
            v-model="codDetails.amount" 
            :placeholder="`Total Amount: ₱${cartTotal}`"
            readonly
          />
        </div>
        <button type="submit" class="submit-payment-button">Submit Payment</button>
      </form>
      <button class="cancel-payment-button" @click="cancelPayment">Cancel</button>
    </div>
  </div>
</template>

<script>
import authService from "@/services/authService";

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
      codDetails: {
        fullName: "",
        contactNumber: "",
        address: "",
        amount: ""
      },
      showSuccessMessage: false,
      successMessage: '',
      showNotification: false,
      notificationMessage: '',
      notificationTimeout: null
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
    this.isAuthenticated = authService.isAuthenticated();
    if (!this.isAuthenticated) {
      this.$router.push('/login');
      return;
    }
    // Load cart items for current user
    this.loadCartItems();
  },
  methods: {
    loadCartItems() {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.email) {
          console.warn('No authenticated user found');
          this.cartItems = [];
          return;
        }

        // Get all carts from localStorage
        const allCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
        
        // Get cart for current user
        this.cartItems = allCarts[currentUser.email] || [];
      } catch (error) {
        console.error('Error loading cart:', error);
        this.cartItems = [];
      }
    },

    saveCartItems() {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.email) {
          console.warn('No authenticated user found');
          return;
        }

        // Get all carts
        const allCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
        
        // Update cart for current user
        allCarts[currentUser.email] = this.cartItems;
        
        // Save back to localStorage
        localStorage.setItem('userCarts', JSON.stringify(allCarts));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    },

    increaseQuantity(index) {
      try {
        this.cartItems[index].quantity += 1;
        this.saveCartItems();
        this.showNotificationMessage('Quantity increased');
      } catch (error) {
        console.error('Error increasing quantity:', error);
        this.showNotificationMessage('Error updating quantity');
      }
    },

    decreaseQuantity(index) {
      try {
        if (this.cartItems[index].quantity > 1) {
          this.cartItems[index].quantity -= 1;
          this.saveCartItems();
          this.showNotificationMessage('Quantity decreased');
        } else {
          this.removeItem(index);
        }
      } catch (error) {
        console.error('Error decreasing quantity:', error);
        this.showNotificationMessage('Error updating quantity');
      }
    },

    removeItem(index) {
      try {
        this.cartItems.splice(index, 1);
        this.saveCartItems();
        this.showNotificationMessage('Item removed from cart');
      } catch (error) {
        console.error('Error removing item:', error);
        this.showNotificationMessage('Error removing item');
      }
    },

    clearCart() {
      try {
        this.cartItems = [];
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.email) {
          const allCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
          delete allCarts[currentUser.email];
          localStorage.setItem('userCarts', JSON.stringify(allCarts));
        }
        this.showNotificationMessage('Cart cleared');
      } catch (error) {
        console.error('Error clearing cart:', error);
        this.showNotificationMessage('Error clearing cart');
      }
    },

    addToCart(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.name === item.name);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push({
          name: item.name,
          price: item.price,
          quantity: 1
        });
      }
      this.saveCartItems();
    },

    validateGcashNumber() {
      // Remove any non-numeric characters from the input
      this.gcashDetails.number = this.gcashDetails.number.replace(/[^0-9]/g, '');
    },
    async submitGcashPayment() {
      try {
        // Validate cart
        if (this.cartItems.length === 0) {
          this.showNotificationMessage('Your cart is empty');
          return;
        }

        // Process GCash payment
        await this.saveOrderToHistory();
        this.clearCart();
        this.showPaymentModal = false;
        this.selectedPayment = null;
        this.showNotificationMessage('Payment successful! Thank you for your order.');
        
        // Reset GCash form
        this.gcashDetails = { 
          name: "", 
          number: "", 
          pin: "", 
          amount: "" 
        };
        
        // Redirect to profile after a short delay
        setTimeout(() => {
          this.$router.push('/profile');
        }, 2000);
      } catch (error) {
        console.error('Error processing payment:', error);
        this.showNotificationMessage('Error processing payment. Please try again.');
      }
    },
    async submitCashOnDeliveryPayment() {
      try {
        // Validate cart
        if (this.cartItems.length === 0) {
          this.showNotificationMessage('Your cart is empty');
          return;
        }

        // Validate form fields
        if (!this.codDetails.fullName || !this.codDetails.contactNumber || !this.codDetails.address) {
          this.showNotificationMessage('Please fill in all required fields');
          return;
        }

        // Process order and save to history
        await this.saveOrderToHistory();
        this.clearCart();
        this.showPaymentModal = false;
        this.selectedPayment = null;
        
        // Show success notification
        this.showNotificationMessage('Order placed successfully! We will deliver your order soon.');
        
        // Reset COD form
        this.codDetails = {
          fullName: "",
          contactNumber: "",
          address: "",
          amount: ""
        };

        // Redirect to profile after a short delay
        setTimeout(() => {
          this.$router.push('/profile');
        }, 2000);
      } catch (error) {
        console.error('Error processing Cash on Delivery order:', error);
        this.showNotificationMessage('Error processing order. Please try again.');
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
        this.showPaymentModal = false;
      } else if (method === "Cash on Delivery") {
        this.codDetails.amount = this.cartTotal;
        this.showPaymentModal = false;
      }
    },
    async saveOrderToHistory() {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.email) {
          throw new Error('No authenticated user found');
        }

        const order = {
          items: this.cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: this.cartTotal,
          date: new Date().toISOString(),
          paymentMethod: this.selectedPayment,
          paymentDetails: this.selectedPayment === 'Gcash' 
            ? {
                name: this.gcashDetails.name,
                number: this.gcashDetails.number,
                amount: this.gcashDetails.amount
              }
            : this.selectedPayment === 'Cash on Delivery'
            ? {
                fullName: this.codDetails.fullName,
                contactNumber: this.codDetails.contactNumber,
                address: this.codDetails.address,
                amount: this.codDetails.amount
              }
            : null
        };

        // Get existing orders or initialize empty object
        const allOrders = JSON.parse(localStorage.getItem('allOrders')) || {};
        
        // Initialize array for this user if it doesn't exist
        if (!allOrders[currentUser.email]) {
          allOrders[currentUser.email] = [];
        }

        // Add new order to the beginning of the array
        allOrders[currentUser.email].unshift(order);
        
        // Save back to localStorage
        localStorage.setItem('allOrders', JSON.stringify(allOrders));
        
        // Trigger storage event for real-time updates
        window.dispatchEvent(new Event('storage'));
        
        console.log('Order saved successfully for user:', currentUser.email);
      } catch (error) {
        console.error('Error saving order:', error);
        throw error;
      }
    },
    formatDate(date) {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    validateContactNumber() {
      this.codDetails.contactNumber = this.codDetails.contactNumber.replace(/[^0-9]/g, '');
    },
    showNotificationMessage(message) {
      // Clear any existing timeout
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }
      
      // Set message and show notification
      this.notificationMessage = message;
      this.showNotification = true;
      
      // Hide notification after 2 seconds
      this.notificationTimeout = setTimeout(() => {
        this.showNotification = false;
      }, 2000);
    },
    cancelPayment() {
      // Reset payment selection
      this.selectedPayment = null;
      
      // Clear payment details
      this.gcashDetails = {
        name: "",
        number: "",
        pin: "",
        amount: ""
      };
      
      this.codDetails = {
        fullName: "",
        contactNumber: "",
        address: "",
        amount: ""
      };
      
      // Close any open payment modals
      this.showPaymentModal = false;
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
  z-index: 1000;
}

.gcash-form h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #4b2d1f;
  font-size: 1.5em;
}

.gcash-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.gcash-form form div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.gcash-form label {
  font-weight: 500;
  color: #4b2d1f;
}

.gcash-form input,
.gcash-form textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.gcash-form textarea {
  min-height: 80px;
  resize: vertical;
}

.gcash-form input:read-only {
  background-color: #f5f5f5;
}

.submit-payment-button {
  background-color: #4b2d1f;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 10px;
}

.submit-payment-button:hover {
  background-color: #3a2218;
}

.cancel-payment-button {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 10px;
  width: 100%;
}

.cancel-payment-button:hover {
  background-color: #d0d0d0;
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

/* Notification Styles */
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

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
