<template>
  <div class="shop-info">
    <img :src="shopImage" alt="Shop Image" class="shop-image"/>
    <div class="shop-details">
      <p><span class="label">Shop Name:</span> BrewScape</p>
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
</template>

<script>
import shopImage from '@/assets/images.png';

export default {
  name: 'ShopInfoComponent',
  data() {
    return {
      hoverRating: 0,
      shopImage
    }
  },
  props: {
    currentRating: {
      type: Number,
      default: 0
    }
  },
  methods: {
    setRating(rating) {
      this.$emit('update-rating', rating);
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
}

.shop-details {
  padding: 20px;
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
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .shop-info {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .shop-image {
    height: 200px;
  }
}
</style>
