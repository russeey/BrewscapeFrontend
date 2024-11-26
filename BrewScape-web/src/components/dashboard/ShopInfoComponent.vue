<template>
  <div class="shop-info">
    <img :src="shopImage" alt="Shop Image" class="shop-image"/>
    <div class="shop-details">
      <p><span class="label">Shop Name:</span> Kape Barato</p>
      <p><span class="label">Shop Location:</span> Pabayo-Chaves Street, Cagayan de Oro City</p>
      <p><span class="label">Contact:</span> 09*********</p>
    </div>
    <div class="shop-rating">
      <p>
        Your Rating:
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ 'filled': star <= getUserRating() || star <= hoverRating }"
          @click="setRating(star)"
          @mouseover="hoverRating = star"
          @mouseleave="hoverRating = 0"
        >
          ★
        </span>
      </p>
      <p>Your Rating: {{ getUserRating() }} stars</p>
      <p v-if="averageRating > 0">Average Shop Rating: {{ averageRating }} stars</p>
      <p v-else>Be the first to rate this shop!</p>
    </div>
  </div>
</template>

<script>
import shopImage from '@/assets/images.png';
import authService from '@/services/authService'; // Assuming authService is defined in this file

export default {
  name: 'ShopInfoComponent',
  data() {
    return {
      hoverRating: 0,
      shopImage,
      userRatings: JSON.parse(localStorage.getItem('userRatings')) || {},
      averageRating: 0
    }
  },
  mounted() {
    this.loadRatings();
  },
  methods: {
    setRating(rating) {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.email) {
        console.warn('User must be logged in to rate');
        return;
      }

      // Get existing ratings
      const ratings = JSON.parse(localStorage.getItem('userRatings')) || {};
      
      // Set this user's rating
      ratings[currentUser.email] = rating;
      
      // Save to localStorage
      localStorage.setItem('userRatings', JSON.stringify(ratings));
      
      // Update average rating
      this.loadRatings();
      
      // Emit the event
      this.$emit('update-rating', rating);
    },
    loadRatings() {
      const ratings = JSON.parse(localStorage.getItem('userRatings')) || {};
      this.userRatings = ratings;
      
      // Calculate average rating
      const ratingValues = Object.values(ratings);
      this.averageRating = ratingValues.length > 0 
        ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
        : 0;
    },
    getUserRating() {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.email) return 0;
      return this.userRatings[currentUser.email] || 0;
    }
  }
}
</script>

<style scoped>
.shop-info {
  flex: 1.5;
  margin-right: 50px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: left;
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 300px;
  max-width: 400px;
  min-height: 400px;
  height: fit-content;
}

.shop-details {
  padding: 20px;
  flex: 1;
}

.shop-details p {
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.5;
}

.label {
  font-weight: bold;
  color: #4d2c16;
}

.shop-rating {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.star {
  cursor: pointer;
  font-size: 26px;
  color: #ddd;
  transition: color 0.2s ease;
}

.star.filled {
  color: #fbc02d;
}

.shop-image {
  width: 80%;
  height: 200px;
  object-fit: contain;
  border-radius: 8px 8px 0 0;
  margin: 20px auto;
  display: block;
}

@media (max-width: 768px) {
  .shop-info {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .shop-image {
    width: 70%;
    height: 150px;
  }
}
</style>
