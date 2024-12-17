<template>
  <div v-if="isAuthenticated" class="dashboard">
    <header class="header">
      <div class="logo">
        <h1>BrewScape</h1>
      </div>
      <button class="cart-button" @click="goToCart">Cart</button>
      <button class="profile-button" @click="goToProfile">Profile</button>
      <button class="logout-button" @click="confirmLogout">Logout</button>
    </header>

    <div class="search-bar">
      <input 
        type="text" 
        class="search-input" 
        placeholder="Search an Item..." 
        v-model="searchTerm" 
        @input="filterMenu" 
      />
    </div>

    <section class="promo">
      <div class="promo-content">
        <h2>{{ promoMessage }}</h2>
        <p>Get up? Please! Stay right where you are and enjoy {{ discount }}.</p>
      </div>
      <div class="promo-image">
      </div>
    </section>

    <section class="promo second-promo">
      <div class="promo-content">
        <h2>{{ secondPromoMessage }}</h2>
      </div>
      <div class="promo-image">
        <img src="@/assets/promotion.png"/>
      </div>
    </section>

    <section class="menu-section">
      <div class="shop-info">
        <div class="shop-details">
          <p><span class="label">Shop Name:</span> Kape Barato</p>
          <p><span class="label">Shop Location:</span> Pabayo-Chaves Street, Cagayan de Oro City</p>
          <p><span class="label">Contact:</span> 09*********</p>
        </div>

        <div class="shop-rating">
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
      </div>

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

    <!-- Footer Section -->
    <footer class="footer">
    </footer>
  </div>

  <!-- If not authenticated -->
  <div v-else>
    <h1>You are not authorized to view this page.</h1>
    <router-link to="/login">Go to Login</router-link>
  </div>
</template>

<script>
import authService from "@/authService";
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase.config';

export default {
  data() {
    return {
      isAuthenticated: false,
      userRole: '', // To store the user's role
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
      discount: "5% off Coffee orders of P1000+",
      currentRating: 0,
      hoverRating: 0
    };
  },
  created() {
    this.isAuthenticated = authService.isAuthenticated;

    if (!this.isAuthenticated) {
      this.$router.push("/login");
    } else {
      // Check user's role
      this.checkUserRole();
      // Load the rating from localStorage if it exists
      const savedRating = localStorage.getItem('brewscapeRating');
      if (savedRating) {
        this.currentRating = parseInt(savedRating);
      }
    }
  },
  methods: {
    async checkUserRole() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // Check user's role in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const adminDocRef = doc(db, "admins", user.uid);

        try {
          const userSnapshot = await getDoc(userDocRef);
          const adminSnapshot = await getDoc(adminDocRef);

          if (adminSnapshot.exists()) {
            // User is an admin
            this.userRole = 'admin';
            this.$router.push("/admin-dashboard");
          } else if (userSnapshot.exists()) {
            // User is a regular user
            this.userRole = 'user';
          } else {
            // Invalid user, log out and redirect to login
            this.logout();
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          this.logout();
        }
      }
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    goToCart() {
      this.$router.push("/cart");
    },
    setRating(rating) {
      this.currentRating = rating;
      localStorage.setItem('brewscapeRating', rating);
    },
    confirmLogout() {
      if (confirm('Are you sure you want to log out?')) {
        this.logout();
      }
    },
    logout() {
      localStorage.removeItem("loggedInUserId");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("brewscapeRating");
      this.$router.push("/login");
    },
    isHighlighted(itemName) {
      return itemName.toLowerCase().includes(this.searchTerm.toLowerCase());
    }
  }
};
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

  .search-bar {
  margin: 3px 0; 
}

.search-input {
  width: 300px; 
  padding: 12px; 
  border: 1px solid #e0e0e0; 
  border-radius: 8px; 
  font-size: 16px; 
  outline: none; 
  transition: border-color 0.3s;
}

.label {
  font-weight: bold; /* Makes the text bold */
}


.search-input:focus {
  border-color: #4b2d1f; 
}

  .highlighted {
    background-color: #ffeb3b; 
  }

  .dashboard {
    padding: 40px;
    background-color: #f8e2c2; 
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }

  /* Header */
  .header {
  display: flex;
  justify-content: flex-end; 
  align-items: center; 
  background-color: #f4f4f4; 
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
    color: #2c3e50; 
    margin-left: 10px;
  }

  .logout-button {
  background-color: #4b2d1f; 
  color: white;
  margin-left: 20px; 
}

.profile-button {
  background-color: #4b2d1f;
  color: white;
  margin-left: 20px;
}

.cart-button {
  background-color: #4b2d1f; 
  color: white;
  margin-left: 980px; 
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
    background-color: #4b2d1f; 
    color: white;
  }

  .promo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    background-color: #f9f9f9;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    width: 50%; 
    margin-left: auto; 
  }

  .promo.second-promo {
  width: 50%; 
  margin: -300px 0 20px 0; 
  padding: 0; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); 
  background-color: #d09a5b; 
  position: relative; 
  left: 0; 
}

.promo-image {
  width: 65%; 
  height: 300px; 
  overflow: hidden; 
}

.promo-image img {
  width: 50%; 
  height: 100%; 
  object-fit: cover; 
  display: block; 
}

.promo-content {
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  text-align: center; 
  padding: 20px;
  margin-left: 200px;
}


.promo-content h2 {
  font-size: 24px;
  font-weight: 1000; 
  color: #bd8e50;
}


  .promo-content p {
    font-size: 20px;
    font-weight: 600;
    color: #4d2c16;
  }

  .promo-image img {
    width: 180px; 
    border-radius: 10px; 
  }

  .menu-section {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
  }

  .shop-info {
  flex: 1.5; 
  margin-right: 50px;
  padding: 10px; 
  background-color: white; 
  border: 1px solid #e0e0e0; 
  border-radius: 8px; 
  text-align: Left; 
  margin-bottom: auto;
  display: flex; 
  flex-direction: column; 
}

.shop-details {
  margin-bottom: 200px; 
}

  
  .menu {
    flex: 3; 
    text-align: center; 
    align-items: center;
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

  .menu {
    display: flex; 
    flex-direction: column; 
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
    color: #fbc02d; 
  }

  .add-to-cart-btn {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .add-to-cart-btn:hover {
    background-color: #45a049;
  }
</style>