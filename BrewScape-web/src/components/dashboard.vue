<template>
    <div class="dashboard">
      <header class="header">
        <div class="logo">
          <img src="path-to-your-logo" alt="BrewScape Logo">
          <h1>BrewScape</h1>
        </div>
        <div class="search-bar">
          <input type="text" placeholder="Search...">
        </div>
        <button class="deal-button">Weekly Deal For You</button>
      </header>
  
      <!-- Promo Section 1 -->
      <section class="promo">
        <div class="promo-content">
          <h2>{{ promoMessage }}</h2>
          <p>Get up? Please! Stay right where you are and enjoy {{ discount }}.</p>
        </div>
        <div class="promo-image">
          <img src="path-to-promo-image-1" alt="Coffee Promotion">
        </div>
      </section>
  
      <!-- Promo Section 2 (additional) -->
      <section class="promo second-promo">
        <div class="promo-content">
          <h2>{{ secondPromoMessage }}</h2>
          <p>Enjoy our new seasonal drinks, available now with 10% off for first-time orders!</p>
        </div>
        <div class="promo-image">
          <img src="path-to-promo-image-2" alt="New Seasonal Drinks">
        </div>
      </section>
  
      <!-- Menu Section -->
      <section class="menu-section">
        <div class="menu">
          <h2>COFFEE & Etc.</h2>
          <ul>
            <li v-for="item in coffeeMenu" :key="item.name">
              {{ item.name }} - {{ item.price }}₱
            </li>
          </ul>
        </div>
        <div class="menu">
          <h2>PASTRIES & Etc.</h2>
          <ul>
            <li v-for="item in pastriesMenu" :key="item.name">
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
  </template>

<script>
export default {
  data() {
    return {
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
      currentRating: 0,   // To store the selected rating
      hoverRating: 0      // To handle hover effect over stars
    };
  },
  methods: {
    setRating(rating) {
      this.currentRating = rating; // Set the current rating based on user click
    }
  }
}
</script>
<style scoped>
/* Basic Styles */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f4eb;
}

.dashboard {
  padding: 20px;
  background-color: #fff8f0;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #dcb08b;
  border-bottom: 2px solid #c98c58;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  width: 40px;
  margin-right: 10px;
}

.logo h1 {
  font-size: 24px;
  color: #4b2c20;
}

.search-bar input {
  padding: 5px;
  font-size: 16px;
  border: 1px solid #c98c58;
}

.deal-button {
  background-color: #8b4513;
  color: #fff;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

/* Promo Section */
.promo {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding: 20px;
  background-color: #f0e4d0;
  border-radius: 10px;
}

.promo-content {
  flex: 1;
}

.promo-content h2 {
  font-size: 24px;
  color: #6b3d1f;
}

.promo-content p {
  font-size: 16px;
  color: #4b2c20;
}

.promo-image img {
  width: 150px;
  height: auto;
  border-radius: 10px;
}

/* Additional Promo Section */
.second-promo {
  margin-top: 20px;
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
  font-size: 20px;
  color: #8b4513;
  margin-bottom: 15px;
}

.menu ul {
  list-style-type: none;
  padding: 0;
}

.menu ul li {
  background-color: #fff;
  padding: 10px;
  margin: 5px 0;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #dcb08b;
}

/* Footer */
.footer {
  margin-top: 50px;
  padding: 15px;
  background-color: #dcb08b;
  text-align: center;
  color: #4b2c20;
}

.footer p {
  margin: 5px 0;
  font-size: 16px;
}

.star {
  cursor: pointer;
  font-size: 24px;
  color: #ccc;
}

.star.filled {
  color: #f5a623;
}
</style>