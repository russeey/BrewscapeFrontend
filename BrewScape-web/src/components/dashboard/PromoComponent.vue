<template>
  <section class="promo">
    <div class="promo-image">
      <img src="@/assets/promotion.png"/>
    </div>
    <div class="promo-content">
      <h2>{{ message }}</h2>
      <p v-if="discount">Get up? Please! Stay right where you are and enjoy. Treat yourself to your favorite brews today—because great coffee is just a click away! {{ discount }}.</p>
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
    }
  }
}
</script>

<style scoped>
.promo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  min-height: 400px;
  border-radius: 12px;
  margin-bottom: 30px;
  padding: 40px;
  gap: 40px;
}

.promo-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  flex: 1;
  padding-left: 40px;
  transform: translateX(-50px);
}

.promo-content h2 {
  font-size: 32px;
  font-weight: 800;
  color: #bd8e50;
  margin-bottom: 20px;
  line-height: 1.2;
  text-align: right;
  transform: translateX(20px); 
}

.promo-content p {
  font-size: 20px;
  font-weight: 600;
  color: #4d2c16;
  margin: 0;
  line-height: 1.5;
}

.promo-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 40px;
}

.promo-image img {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.promo-image img:hover {
  transform: scale(1.02);
}

@media (max-width: 1024px) {
  .promo {
    padding: 30px;
    gap: 30px;
  }

  .promo-content {
    padding-left: 20px;
  }

  .promo-image {
    padding-right: 20px;
  }

  .promo-content h2 {
    font-size: 28px;
  }

  .promo-content p {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .promo {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }

  .promo-content {
    padding-left: 0;
    align-items: center;
    text-align: center;
  }

  .promo-image {
    padding-right: 0;
  }

  .promo-image img {
    max-width: 300px;
  }
}
</style>
