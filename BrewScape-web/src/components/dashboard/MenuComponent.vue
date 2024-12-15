<template>
  <div class="menu">
    <h2>{{ title }}</h2>
    <ul>
      <li 
        v-for="item in filteredItems" 
        :key="item.name"
        class="menu-item"
      >
        <div class="item-image" v-if="item.image">
          <img :src="getImageUrl(item.image)" :alt="item.name">
        </div>
        <div class="item-details">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-price">{{ item.price }}₱</span>
          <button class="add-to-cart" @click="addToCart(item)">Add to Cart</button>
        </div>
      </li>
    </ul>
    <transition name="fade">
      <div v-if="showNotification" class="notification">
        {{ notificationMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import authService from "@/services/authService";
export default {
  name: 'MenuComponent',
  data() {
    return {
      showNotification: false,
      notificationMessage: '',
      notificationTimeout: null
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    searchTerm: {
      type: String,
      default: ''
    }
  },
  computed: {
    filteredItems() {
      if (!this.searchTerm) return this.items;
      const search = this.searchTerm.toLowerCase();
      return this.items.filter(item => 
        item.name.toLowerCase().includes(search)
      );
    }
  },
  methods: {
    getImageUrl(image) {
      return new URL(`../../assets/${image}`, import.meta.url).href;
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
    async addToCart(item) {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.email) {
          this.showNotificationMessage('Please log in to add items to cart');
          return;
        }

        // Get existing cart items for the current user
        const allCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
        const userCart = allCarts[currentUser.email] || [];
        
        const existingItem = userCart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          userCart.push({
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image
          });
        }
        
        allCarts[currentUser.email] = userCart;
        localStorage.setItem('userCarts', JSON.stringify(allCarts));
        
        this.showNotificationMessage(`${item.name} added to cart!`);
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.showNotificationMessage('Error adding item to cart');
      }
    }
  }
}
</script>

<style scoped>
.menu {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex: 1;
  min-width: 300px;
}

.menu h2 {
  margin-bottom: 20px;
  color: #4b2d1f;
  font-size: 1.8em;
  font-weight: 800;
  text-align: center;
  padding: 10px 0;
  border-bottom: 2px solid #4b2d1f;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #eee;
  gap: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 8px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-weight: 600;
  color: #333;
  font-size: 1.1em;
}

.item-price {
  color: #666;
  font-weight: 500;
}

.add-to-cart {
  background-color: #4b2d1f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 500;
  align-self: flex-start;
}

.add-to-cart:hover {
  background-color: #3a2218;
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

@media (max-width: 768px) {
  .menu {
    padding: 15px;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
  }
}
</style>
