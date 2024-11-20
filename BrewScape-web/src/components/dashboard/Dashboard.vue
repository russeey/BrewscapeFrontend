<template>
  <div v-if="isAuthenticated" class="dashboard">
    <nav class="navbar">
      <div class="nav-brand">BrewScape</div>
      <div class="nav-links">
        <button class="nav-btn" @click="goToCart">Cart</button>
        <button class="nav-btn" @click="goToProfile">Profile</button>
        <button class="nav-btn logout" @click="logout">Logout</button>
      </div>
    </nav>

    <promo-component
      :message="promoMessage"
      :discount="discount"
    />

    <section class="menu-section">
      <shop-info-component
        :currentRating="currentRating"
        @update-rating="setRating"
      />

      <div class="menu-container">
        <search-bar-component
          :searchTerm="searchTerm"
          @input="searchTerm = $event"
          class="search-above-menu"
        />
        
        <div class="menu-items">
          <menu-component
            title="COFFEE & Etc."
            :items="coffeeMenu"
            :searchTerm="searchTerm"
          />

          <menu-component
            title="PASTRIES & Etc."
            :items="pastriesMenu"
            :searchTerm="searchTerm"
          />
        </div>
      </div>
    </section>

    <footer class="footer">
      <p> 2023 BrewScape. All rights reserved.</p>
    </footer>
  </div>
  <div v-else>
    <h1>You are not authorized to view this page.</h1>
    <router-link to="/login">Go to Login</router-link>
  </div>
</template>

<script>
import authService from "@/services/authService";
import PromoComponent from './PromoComponent.vue';
import SearchBarComponent from './SearchBarComponent.vue';
import ShopInfoComponent from './ShopInfoComponent.vue';
import MenuComponent from './MenuComponent.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  components: {
    PromoComponent,
    SearchBarComponent,
    ShopInfoComponent,
    MenuComponent
  },
  setup() {
    const router = useRouter();
    const searchTerm = ref('');
    const isAuthenticated = ref(false);
    const coffeeMenu = ref([
      { name: 'Iced Cappuccino', price: 120 },
      { name: 'Salted Caramel Cold Brew', price: 120 },
      { name: 'Caffè Misto', price: 120 },
      { name: 'Caramel Macchiato', price: 120 },
      { name: 'Iced Coffee', price: 120 }
    ]);
    const pastriesMenu = ref([
      { name: 'Chocolate Chip Cookie', price: 60 },
      { name: 'Classic Croissant', price: 60 },
      { name: 'Blueberry Muffin', price: 60 }
    ]);
    const promoMessage = ref("Relax with a refreshing delivery deal");
    const secondPromoMessage = ref("Special Offer");
    const discount = ref("5% off Coffee orders of P1000+");
    const currentRating = ref(0);

    onMounted(() => {
      isAuthenticated.value = authService.isAuthenticated();
      const savedRating = localStorage.getItem('brewscapeRating');
      if (savedRating) {
        currentRating.value = parseInt(savedRating);
      }

      // Add auth state listener
      authService.addAuthStateListener((user) => {
        isAuthenticated.value = !!user;
      });
    });

    const goToProfile = () => {
      router.push("/profile");
    };

    const goToCart = () => {
      router.push("/cart");
    };

    const setRating = (rating) => {
      currentRating.value = rating;
      localStorage.setItem('brewscapeRating', rating.toString());
    };

    const logout = async () => {
      try {
        await authService.signOut();
        router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    return {
      isAuthenticated,
      searchTerm,
      coffeeMenu,
      pastriesMenu,
      promoMessage,
      secondPromoMessage,
      discount,
      currentRating,
      goToProfile,
      goToCart,
      setRating,
      logout
    };
  }
};
</script>

<style scoped>
.dashboard {
  padding: 40px;
  background-color: #f8e2c2;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
}

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

.menu-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
  min-height: 600px;
}

.menu-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  min-width: 600px;
  height: fit-content;
}

.menu-items {
  display: flex;
  gap: 30px;
  min-height: 400px;
}

.search-above-menu {
  width: 100%;
}

.footer p {
  font-size: 18px;
  color: #555;
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .menu-section {
    flex-direction: column;
  }

  .menu-items {
    flex-direction: column;
  }
}
</style>
