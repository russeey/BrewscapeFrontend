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
              <li><router-link to="/login" class="button">Sign In</router-link></li>
              <li><router-link to="/signup" class="button">Join Now</router-link></li>
            </ul>
          </nav>
        </div>
      </header>
  
      <!-- Promo Section -->
      <section class="promo">
        <div class="promo-content">
          <div class="promotion-image">
            <img src="@/assets/promotion.png" alt="promotion" class="promotion" />
          </div>
          <div class="promo-text">
            <h2>Hop into half off</h2>
            <p>
              This week, play the Winter It On Snowman Hunt game to earn 50% off a
              winter treat—like a hot Spanish Latte.
            </p>
            <button @click="joinFun">Join the fun</button>
          </div>
        </div>
      </section>
  
      <!-- Explore Coffee Shop Section -->
      <section class="explore">
        <div class="explore-content">
          <img src="@/assets/promotion2.png" alt="Latte Art" />
          <div>
            <h2>Explore Local COFFEE SHOP Here in CDO.</h2>
            <button @click="joinFun">Join the fun</button>
          </div>
        </div>
      </section>
  
      <!-- About Us Section -->
      <section id="about-us">
        <h2>About Us</h2>
        <p>---Details---</p>
      </section>
  
      <!-- For Business Partners Section -->
      <section id="business-partners">
        <h2>For Business Partners</h2>
        <p>---Details---</p>
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
    export default {
      methods: {
        orderNow() {
          alert("Ordering Now!");
        },
        joinFun() {
          this.$router.push("/signup");
        }
      }
    };
    </script>
    
    <style scoped>
  * {
      margin: 0;
      padding: 0%;
      box-sizing: border-box;
  }
  
  body {  
      font-family: 'Arial', sans-serif;  
      background-color: #ffffff; 
      color: #ffffff;  
      margin: 0;  
      padding: 0;   
      overflow-x: hidden;  
  }  
  
  header {  
      background-color: #f8e2c2;  
      padding: 20px;  
      color: #4b2d1f;  
      position: sticky;  
      top: 0;  
      z-index: 100;  
      width: 100%;  
  }  
  
  main {  
      max-width: 1200px; 
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
      gap: 15px; /* Reduced gap between logo and text */
  }
  
  .logo-section .logo {
      width: 30px;  /* Reduced logo size */
      height: auto;
  }
  
  .logo-section span {
      font-size: 1.2rem;  /* Reduced font size for compact design */
      font-weight: bold;
      color: #4b2d1f;
  }
  
  .nav-links-left {
      display: flex;
      list-style: none;
      gap: 15px; /* Reduced gap between links */
  }
  
  .nav-links-left li a {
      text-decoration: none;
      font-size: 0.9rem; /* Reduced font size for links */
      color: #4b2d1f;
      transition: color 0.3s ease;
  }
  
  .nav-links-left li a:hover {
      color: #d5a874;
  }
  
  .nav {
      display: flex;
      list-style: none;
      gap: 15px; /* Reduced gap between right-side buttons */
  }
  
  .nav .button {
      padding: 10px 15px;  /* Reduced button padding for compact design */
      background-color: #8a5e4a;
      color: #fff;
      border-radius:10px;  /* Smaller border-radius */
      text-decoration: none;
      font-size: 0.9rem;  /* Reduced font size */
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
      padding: 50px;
      background-color: #deb887;
      height: auto;
      min-height: 60vh;
      color: #4b2d1f;
  }
  
  .promo-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 20px;
  }
  
  .promotion-image img {
      width: 350px; /* Adjust the image size */
      height: auto;
  }
  
  .promo-text {
      color: #4b2d1f;
      text-align: left;
      max-width: 45%;
      display: flex;
      flex-direction: column;
      justify-content: center; /* Make sure text is vertically centered */
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
      max-width: 45%; /* Adjust the width of the winter game section */
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
  
  /* Responsive Adjustments */
  @media (max-width: 768px) {
      .promo {
          flex-direction: column; /* Stack the items on smaller screens */
          text-align: center;
      }
  
      .promo-content {
          flex-direction: column; /* Stack image and text on small screens */
      }
  
      .promo-text, .winter-game {
          max-width: 100%;
      }
  }
  
  
  .winter-game button, .promo-text button, .explore-content button {
      background-color: #4b2d1f;
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
      border-radius: 5px;
  }
  
  .winter-game button:hover, .promo-text button:hover, .explore-content button:hover {
      background-color: #2f1a0f;
  }
  
  /* Explore Section */
  .explore {
      padding: 50px;
      color: #ffffff;
      background-color: #d5a874;
  }
  
  .explore-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
  }
  
  .explore-content img {
      width: 200px;
      margin-bottom: 20px;
  }
  
  .explore-content div {
      text-align: left;
  }
  
  .explore-content h2 {
      font-size: 2rem;
      margin-bottom: 20px;
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
  
  #about-us, #business-partners {
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
      .promo, .explore {
          flex-direction: column;
          text-align: center;
          padding: 20px;
      }
  
      .promo-content {
          flex-direction: column;
      }
  
      .promo-text, .promotion-image {
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
  
    