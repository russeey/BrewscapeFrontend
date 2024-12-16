import Home from "./components/homepage.vue";
import Login from "./components/login.vue";
import SignUp from "./components/signup.vue";
import Dashboard from "./components/dashboard/Dashboard.vue";
import profile from "./components/profile.vue";
import cart from './components/cart.vue';
import AdminLogin from './components/admin-login.vue';
import AdminDashboard from "./components/AdminDashboard.vue";
import OwnerLogin from './components/owner-login.vue';
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
      path: "/admin-login",
      name: "AdminLogin",
      component: AdminLogin,
      meta: { requiresGuest: true }
    },
    {
      path: "/owner-login",
      name: "OwnerLogin",
      component: OwnerLogin,
      meta: { requiresGuest: true }
    },
    {
      path: '/owner-dashboard',
      name: 'ownerDashboard',
      component: () => import('@/components/ownerDashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: "/admin-dashboard",
      name: "AdminDashboard",
      component: AdminDashboard,
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
