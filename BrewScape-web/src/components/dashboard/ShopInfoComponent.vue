<template>
  <div class="shop-info">
    <div class="shop-details">
      <p><span class="label">Shop Name:</span> BrewScape</p>
      <p><span class="label">Shop Location:</span> Pabayo-Chaves Street, Cagayan de Oro City</p>
      <p><span class="label">Contact:</span> 09*********</p>
      <img src="@/assets/images.png" alt="Shop Image" class="shop-image"/>
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
export default {
  name: 'ShopInfoComponent',
  data() {
    return {
      hoverRating: 0
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

.label {
  font-weight: bold;
}

.star {
  cursor: pointer;
  font-size: 26px;
  color: #ddd;
}

.star.filled {
  color: #fbc02d;
}

.shop-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}
</style>
