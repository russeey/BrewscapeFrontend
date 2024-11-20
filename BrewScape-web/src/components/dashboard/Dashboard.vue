<template>
  <div v-if="authService.isAuthenticated" class="dashboard">
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

    <promo-component
      :message="secondPromoMessage"
      :imageSrc="require('@/assets/images.png')"
      :isSecondPromo="true"
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

export default {
  name: 'Dashboard',
  components: {
    HeaderComponent,
    SearchBarComponent,
    PromoComponent,
    ShopInfoComponent,
    MenuComponent
  },
  data() {
    return {
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
      secondPromoMessage: "Special Offer",
      discount: "5% off Coffee orders of P1000+",
      currentRating: 0
    };
  },
  created() {
    // Load saved rating
    const savedRating = localStorage.getItem('brewscapeRating');
    if (savedRating) {
      this.currentRating = parseInt(savedRating);
    }
  },
  methods: {
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
    async logout() {
      const result = await authService.logout();
      if (result.success) {
        this.$router.push("/login");
      } else {
        console.error("Logout failed:", result.error);
      }
    }
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
}
</style>
