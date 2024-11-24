<template>
  <div class="menu">
    <h2>{{ title }}</h2>
    <ul>
      <li 
        v-for="item in filteredItems" 
        :key="item.name"
      >
        {{ item.name }} - {{ item.price }}₱
        <button class="add-to-cart" @click="addToCart(item)">Add to Cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MenuComponent',
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
    addToCart(item) {
      // Get existing cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      // Check if item already exists in cart
      const existingItem = cartItems.find(i => i.name === item.name);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          name: item.name,
          price: item.price,
          quantity: 1
        });
      }
      
      // Save updated cart back to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // Show confirmation message
      alert(`${item.name} added to cart!`);
    }
  }
}
</script>

<style scoped>
.menu {
  flex: 3;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.menu h2 {
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
}

.menu ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

.menu ul li {
  flex: 1;
  min-width: 450px;
  max-width: 450px;
  padding: 15px;
  background-color: #fafafa;
  margin-bottom: 10px;
  border-radius: 70px;
  border: 1px solid #e0e0e0;
  font-size: 18px;
  color: #444;
  box-shadow: none;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}

.menu ul li:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-to-cart {
  background-color: #4b2d1f;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart:hover {
  background-color: #6b3f2d;
}
</style>
