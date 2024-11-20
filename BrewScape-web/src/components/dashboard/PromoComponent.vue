<template>
  <section class="promo" :class="{ 'second-promo': isSecondPromo }">
    <div class="promo-content">
      <h2>{{ message }}</h2>
      <p v-if="discount">Get up? Please! Stay right where you are and enjoy {{ discount }}.</p>
    </div>
    <div class="promo-image">
      <img v-if="imageSrc" :src="imageSrc"/>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PromoComponent',
  props: {
    message: {
      type: String,
      required: true
    },
    discount: {
      type: String,
      default: ''
    },
    imageSrc: {
      type: String,
      default: ''
    },
    isSecondPromo: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
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
</style>
