<template>
  <div v-if="isAuthenticated" class="dashboard">
    <header-component
      @go-to-cart="goToCart"
      @go-to-profile="goToProfile"
      @logout="confirmLogout"
      class="header-margin"
    />

    <div v-if="showNotification" class="notification">You have logged out successfully!</div>

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
import HeaderComponent from './HeaderComponent.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  components: {
    PromoComponent,
    SearchBarComponent,
    ShopInfoComponent,
    MenuComponent,
    HeaderComponent
  },
  setup() {
    const router = useRouter();
    const searchTerm = ref('');
    const isAuthenticated = ref(false);
    const coffeeMenu = ref([
      { name: 'Iced Cappuccino', price: 120, image: 'Iced Cappucino.jpg' },
      { name: 'Salted Caramel Cold Brew', price: 170, image: 'Salted Caramel Cold Brew.jpg' },
      { name: 'Caffè Misto', price: 130, image: 'Caffè Misto.jpg' },
      { name: 'Caramel Macchiato', price: 150, image: 'Caramel Macchiato.jpg' },
      { name: 'Iced Coffee', price: 115, image: 'Iced Coffee.jpg' }
    ]);
    const pastriesMenu = ref([
      { name: 'Chocolate Chip Cookie', price: 60, image: 'Chocolate Chip Cookie.png' },
      { name: 'Classic Croissant', price: 90, image: 'Classic Croissant.png' },
      { name: 'Blueberry Muffin', price: 120, image: 'Blueberry Muffin.png' },
      { name: 'Double Chocolate BC', price: 120, image: 'Double Chocolate BC.jpg' },
      { name: 'White Chocolate Mousse', price: 150, image: 'White Chocolate Mousse.jpg' }
    ]);
    const promoMessage = ref("Relax with a refreshing delivery deal");
    const secondPromoMessage = ref("Special Offer");
    const discount = ref("5% off Coffee orders of P1000+");
    const currentRating = ref(0);
    const showNotification = ref(false);

    onMounted(() => {
      isAuthenticated.value = authService.isAuthenticated();
      if (!isAuthenticated.value) {
        router.push('/login');
        return;
      }
      const savedRating = localStorage.getItem('brewscapeRating');
      if (savedRating) {
        currentRating.value = parseInt(savedRating);
      }
    });

    const goToCart = () => {
      router.push('/cart');
    };

    const goToProfile = () => {
      router.push('/profile');
    };

    const logout = async () => {
      try {
        await authService.logout();
        isAuthenticated.value = false;
        showNotification.value = true; 
        setTimeout(() => { showNotification.value = false; }, 3000); 
        router.push('/');  
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    const confirmLogout = () => {
      if (confirm('Are you sure you want to log out?')) {
        logout();
      }
    };

    const setRating = (rating) => {
      currentRating.value = rating;
      localStorage.setItem('brewscapeRating', rating.toString());
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
      goToCart,
      goToProfile,
      confirmLogout,
      setRating,
      showNotification,
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

.header-margin {
  margin-bottom: 30px;
}

.menu-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
  min-height: 600px;
  gap: 30px;
}

.menu-container {
  display: flex;
  flex: 2;
  flex-direction: column;
  min-width: 600px;
  height: fit-content;
  gap: 20px;
}

.menu-items {
  display: flex;
  gap: 30px;
  min-height: 400px;
}

.search-above-menu {
  width: 100%;
  margin-bottom: 20px;
  padding: 0 10px;
}

.footer p {
  font-size: 18px;
  color: #555;
  text-align: center;
  margin-top: 40px;
}

.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #4caf50;
  color: white;
  padding: 20px;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .menu-section {
    flex-direction: column;
  }

  .menu-items {
    flex-direction: column;
  }
}
</style>
