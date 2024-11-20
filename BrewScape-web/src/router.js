import Home from "./components/homepage.vue";
import Login from "./components/login.vue";
import SignUp from "./components/signup.vue";
import Dashboard from "./components/dashboard/Dashboard.vue";
import profile from "./components/profile.vue";
import cart from './components/cart.vue';
import authService from '@/services/authService';

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
      meta: { requiresGuest: true }
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp,
      meta: { requiresGuest: true }
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: "/profile",
      name: "Profile",
      component: profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/cart',
      name: 'Cart',
      component: cart,
      meta: { requiresAuth: true }
    }
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // Handle routes that require guest access (like login page)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
