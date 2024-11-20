<template>
  <div v-if="isAuthenticated" class="dashboard">
    <header-component
      @go-to-cart="goToCart"
      @go-to-profile="goToProfile"
      @logout="logout"
    />

    <search-bar-component
      :searchTerm="searchTerm"
      @input="searchTerm = $event"
    />

    <promo-component
      :message="promoMessage"
      :discount="discount"
    />

    <section class="menu-section">
      <shop-info-component
        :currentRating="currentRating"
        @update-rating="setRating"
      />

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
import HeaderComponent from './HeaderComponent.vue';
import SearchBarComponent from './SearchBarComponent.vue';
import PromoComponent from './PromoComponent.vue';
import ShopInfoComponent from './ShopInfoComponent.vue';
import MenuComponent from './MenuComponent.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  components: {
    HeaderComponent,
    SearchBarComponent,
    PromoComponent,
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
  border-radius: 12px;
}

.menu-section {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.footer p {
  font-size: 18px;
  color: #555;
  text-align: center;
  margin-top: 40px;
}
</style>
