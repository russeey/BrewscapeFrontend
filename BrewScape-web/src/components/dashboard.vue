<template>
  <div v-if="isAuthenticated" class="dashboard">
    <header class="header">
      <div class="logo">
        <h1>BrewScape</h1>
      </div>
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search..." 
          v-model="searchTerm" 
          @input="filterMenu" 
        />
      </div>
      <button class="deal-button">Weekly Deal For You</button>
      <button class="logout-button" @click="logout()">Logout</button>
    </header>

    <!-- Promo Section 1 -->
    <section class="promo">
      <div class="promo-content">
        <h2>{{ promoMessage }}</h2>
        <p>Get up? Please! Stay right where you are and enjoy {{ discount }}.</p>
      </div>
      <div class="promo-image">
        <!-- <img src="path-to-promo-image-1" alt="Coffee Promotion"> -->
      </div>
    </section>

    <!-- Promo Section 2 -->
    <section class="promo second-promo">
      <div class="promo-content">
        <h2>{{ secondPromoMessage }}</h2>
        <p>Enjoy our new seasonal drinks, available now with 10% off for first-time orders!</p>
      </div>
      <div class="promo-image">
        <!-- <img src="path-to-promo-image-2" alt="New Seasonal Drinks"> -->
      </div>
    </section>

    <!-- Menu Section -->
    <section class="menu-section">
      <div class="menu">
        <h2>COFFEE & Etc.</h2>
        <ul>
          <li 
            v-for="item in filteredCoffeeMenu" 
            :key="item.name" 
            :class="{ highlighted: isHighlighted(item.name) }"
          >
            {{ item.name }} - {{ item.price }}₱
          </li>
        </ul>
      </div>
      <div class="menu">
        <h2>PASTRIES & Etc.</h2>
        <ul>
          <li 
            v-for="item in filteredPastriesMenu" 
            :key="item.name" 
            :class="{ highlighted: isHighlighted(item.name) }"
          >
            {{ item.name }} - {{ item.price }}₱
          </li>
        </ul>
      </div>
    </section>

    <!-- Footer Section with Interactive Rating -->
    <footer class="footer">
      <div class="shop-info">
        <p>Shop Name: BrewScape</p>
        <p>Shop Location: Your Location</p>
        <p>Contact: Your Contact Info</p>
        <p>
          Ratings:
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ 'filled': star <= currentRating || star <= hoverRating }"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
          >
            ★
          </span>
        </p>
        <p>Your Rating: {{ currentRating }} stars</p>
      </div>
    </footer>
  </div>
  <div v-else>
    <h1>You are not authorized to view this page.</h1>
    <router-link to="/log in">Go to Login</router-link>
  </div>
</template>

<script>
import authService from "@/authService";

export default {
  data() {
    return {
      isAuthenticated: false,
      searchTerm: '',
      coffeeMenu: [
        { name: 'Iced Cappuccino', price: 120 },
        { name: 'Salted Caramel Cold Brew', price: 120 },
        { name: 'Caffè Misto', price: 120 },
        { name: 'Iced Caffè Latte', price: 120 },
        { name: 'Iced Caffè Mocha', price: 120 },
        { name: 'Iced Caramel Macchiato', price: 120 }
      ],
      pastriesMenu: [
        { name: 'Carrotita Cake', price: 100 },
        { name: 'Brookie Whoopie Pie', price: 100 },
        { name: 'Chocolate Truffle', price: 100 },
        { name: 'Sausage Roll', price: 100 }
      ],
      promoMessage: "Relax with a refreshing delivery deal",
      secondPromoMessage: "Exciting seasonal drinks are here!",
      discount: "5% off Coffee orders of P1000+",
      currentRating: 0,
      hoverRating: 0
    };
  },
  created() {
    this.isAuthenticated = authService.isAuthenticated;

    if (!this.isAuthenticated) {
      this.$router.push("/login");
    }
  },
  computed: {
    filteredCoffeeMenu() {
      return this.coffeeMenu.filter(item => 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    filteredPastriesMenu() {
      return this.pastriesMenu.filter(item => 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  methods: {
    setRating(rating) {
      this.currentRating = rating;
    },
    logout() {
      localStorage.removeItem("loggedInUserId");
      this.$router.push("/login");
    },
    isHighlighted(itemName) {
      return itemName.toLowerCase().includes(this.searchTerm.toLowerCase());
    }
  }
}
</script>

<style scoped>
/* General Layout */
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f7f7f7;
  color: #333;
  margin: 0;
  padding: 0;
}

/* Highlighted Item */
.highlighted {
  background-color: #ffeb3b; /* Highlight color for matched items */
}

/* Dashboard Wrapper */
.dashboard {
  padding: 40px;
  background-color: #f8e2c2; /* Card-style dashboard */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f4f4f4; /* Lighter header background */
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  display: flex;
  align-items: center;
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50; /* Darker text for logo */
  margin-left: 10px;
}

/* Buttons */
button {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.deal-button {
  background-color: #4b2d1f; /* Figma's accent color */
  color: white;
}

.logout-button {
  background-color: #4b2d1f; /* Logout button color */
  color: white;
}

/* Promo Section */
.promo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
}

.promo-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.promo-content p {
  font-size: 18px;
  color: #777;
}

.promo-image img {
  width: 180px; /* Image size */
  border-radius: 10px; /* Rounded corners for promo images */
}

/* Menu Section */
.menu-section {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.menu {
  flex: 1;
  margin-right: 20px;
}

.menu h2 {
  font-size: 22px;
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
}

.menu ul {
  list-style: none;
  padding: 0;
}

.menu ul li {
  padding: 15px;
  background-color: #fafafa;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 18px;
  color: #444;
}

/* Footer and Ratings */
.footer {
  margin-top: 60px;
  padding: 30px;
  background-color: #f0f0f0;
  text-align: center;
  border-top: 1px solid #ddd;
}

.footer p {
  font-size: 18px;
  color: #555;
}

.star {
  cursor: pointer;
  font-size: 26px;
  color: #ddd;
}

.star.filled {
  color: #fbc02d; /* Golden filled stars */
}
</style>
