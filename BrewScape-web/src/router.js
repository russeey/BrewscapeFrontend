import Home from "./components/homepage.vue";
import Login from "./components/login.vue";
import SignUp from "./components/signup.vue";
import Dashboard from "./components/dashboard.vue"; // Import your dashboard
import profile from "./components/profile.vue";
import profileImage from '@/assets/gratis-png-noragami-anime-manga-yato-no-kami-youtube-anime-thumbnail.png';
import cart from './components/cart.vue';


import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp,
    },
    {
      path: "/dashboard", // Add this route
      name: "Dashboard",
      component: Dashboard,
    },
    {
      path: "/profile",
      name: "Profile",
      component: profile,
    },
    {
      path: '/cart',
      name: 'Cart',
      component: cart
    }
  ],
});

export default router;
