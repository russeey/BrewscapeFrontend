  <template>
  <div>
    <header>
      <div class="navbar">
        <div class="logo-section">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <span>BrewScape</span>
          <ul class="nav-links-left">
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#business-partners">For Business Partners</a></li>
          </ul>
        </div>
        <nav>
          <ul class="nav">
            <li>
              <router-link to="/login" class="button">Sign In</router-link>
            </li>
            <li>
              <router-link to="/signup" class="button">Join Now</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Promo Section -->
    <section class="promo">
        <div class="promotion-image">
          <img src="@/assets/promotion.png" alt="promotion" class="promotion" />
        </div>
        <div class="promo-text">
          <h2>Hop into half off</h2>
          <p>
            This week, play the Winter It On Snowman Hunt game to earn 50% off a
            winter treat—like a hot Spanish Latte.
          </p>
          <button @click="joinFun" v-if="!isAuthenticated">Join the fun</button>
          <button @click="checkAuth" v-else>Go to Dashboard</button>
        </div>
    </section>

    <!-- Explore Coffee Shop Section -->
    <section class="explore">
      <div class="explore-content">
        <img src="@/assets/promotion2.png" alt="Latte Art" />
        <div class="text-container">
          <h2>Explore Local COFFEE SHOP Here in CDO.</h2>
          <button @click="joinFun" v-if="!isAuthenticated" class="join-button">Join the fun</button>
          <button @click="checkAuth" v-else class="join-button">Go to Dashboard</button>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section id="about-us">
      <h2>About Us</h2>
      <p>Welcome to BrewScape, your cozy retreat in the heart of Cagayan de Oro City! ☕✨</p>
    </section>

    <!-- For Business Partners Section -->
    <section id="business-partners">
      <h2>For Business Partners</h2>
      <p>At BrewScape, we believe partnerships drive growth and success.</p>
<p>We’re committed to building strong, mutually beneficial relationships with local businesses, suppliers, and community organizations.</p>

    </section>
    <!-- Footer Section -->
    <footer>
      <div class="footer-links">
        <a href="#">Privacy Notice</a> |
        <a href="#">Consumer Health Privacy Notice</a> |
        <a href="#">Terms of Use</a>
      </div>
    </footer>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import authService from '@/services/authService';

export default {
  name: 'Homepage',
  setup() {
    const router = useRouter();
    const isAuthenticated = ref(false);

    onMounted(() => {
      isAuthenticated.value = authService.isAuthenticated();
    });

    const joinFun = () => {
      router.push('/signup');
    };

    const checkAuth = () => {
      router.push('/dashboard');
    };

    return {
      isAuthenticated,
      joinFun,
      checkAuth
    };
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  background-color: #ffffff;
  color: #ffffff;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

header {
  background-color: #f8e2c2;
  padding: 20px;
  color: #f4b22f;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

main {
  max-width: 2000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  background-color: #f5e6d1;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px; 
}

.logo-section .logo {
  width: 30px; 
  height: auto;
}

.logo-section span {
  font-size: 1.2rem; 
  font-weight: bold;
  color: #4b2d1f;
}

.nav-links-left {
  display: flex;
  list-style: none;
  gap: 15px; 
}

.nav-links-left li a {
  text-decoration: none;
  font-size: 0.9rem; 
  color: #4b2d1f;
  transition: color 0.3s ease;
}

.nav-links-left li a:hover {
  color: #d5a874;
}

.nav {
  display: flex;
  list-style: none;
  gap: 15px; 
}

.nav .button {
  padding: 10px 15px; 
  background-color: #8a5e4a;
  color: #fff;
  border-radius: 10px; 
  text-decoration: none;
  font-size: 0.9rem; 
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.nav .button:hover {
  background-color: #2f1a0f;
}

/* Promo Section */
.promo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #deb887;
  height: auto;
  min-height: 70vh;
  color: #4b2d1f;
}

.promotion-image{
  width: 100%;
  height: 70vh;
  background-color: black;
}

.promotion-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.promo-text {
  color: #4b2d1f;
  width: 100%;
  height: 70vh;
  padding: 40px;
  background-color: white;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center; 
}

.promo-text h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.promo-text p {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.promo-text button {
  background-color: #4b2d1f;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.promo-text button:hover {
  background-color: #2f1a0f;
}

.winter-game {
  text-align: left;
  max-width: 45%; 
}

.winter-game h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.winter-game p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.winter-game button {
  background-color: #4b2d1f;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.winter-game button:hover {
  background-color: #2f1a0f;
}

@media (max-width: 768px) {
  .promo {
    flex-direction: column; 
    text-align: center;
  }

  .promo-content {
    flex-direction: column; 
  }

  .promo-text,
  .winter-game {
    max-width: 100%;
  }
}

.winter-game button,
.promo-text button,
.explore-content button {
  background-color: #4b3f1f;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.winter-game button:hover,
.promo-text button:hover,
.explore-content button:hover {
  background-color:  #c3984eda;
}

/* Explore Section */
.explore {
  padding: 50px;
  color: #ffffff;
  background-color: #4d2b05;
}

.explore-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  position: relative; 
}

.explore-content img {
  width: 300px;
  margin-bottom: 20px;
  padding: 20px;
}

.explore-content .text-container {
  text-align: center;
  position: relative;
  padding: 20px;
}

.explore-content h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.join-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #444b1f;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.join-button:hover {
  background-color: #2f220f;
}

.explore-content button {
  background-color: #4b2d1f;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.explore-content button:hover {
  background-color: #2f1a0f;
}

/* Section Styling */
section {
  padding: 100px 50px;
}

#about-us,
#business-partners {
  background-color: #ffffff;
  text-align: center;
  color: #000000;
  padding: 50px;
}

footer {
  padding: 20px;
  background-color: #f5e6d1;
  text-align: center;
}

.footer-links {
  font-size: 0.9rem;
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .promo,
  .explore {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .promo-content {
    flex-direction: column;
  }

  .promo-text,
  .promotion-image {
    max-width: 100%;
  }

  .promo-text h2 {
    font-size: 2rem;
  }

  .promo-text p {
    font-size: 1.2rem;
  }
}
</style>
