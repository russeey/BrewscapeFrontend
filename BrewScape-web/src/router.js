import Home from "./components/homepage.vue";
import Login from "./components/login.vue";
import SignUp from "./components/signup.vue";
import Dashboard from "./components/dashboard/Dashboard.vue";
import Profile from "./components/profile.vue";
import Cart from './components/cart.vue';
import AdminLogin from './components/admin-login.vue';
import AdminDashboard from "./components/AdminDashboard.vue";
import OwnerLogin from './components/owner-login.vue';
import OwnerDashboard from '@/components/ownerDashboard.vue';
import authService from '@/services/authService';

import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: { requiresGuest: true },
  },
  {
    path: "/admin-login",
    name: "AdminLogin",
    component: AdminLogin,
    meta: { requiresGuest: true },
  },
  {
    path: "/admin-dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/owner-login",
    name: "OwnerLogin",
    component: OwnerLogin,
    meta: { requiresGuest: true },
  },
  {
    path: "/owner-dashboard",
    name: "OwnerDashboard",
    component: OwnerDashboard,
    meta: { requiresAuth: true, role: "owner" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, role: "user" },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = isAuthenticated ? await authService.getUserProfile() : null;

  // Handle authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard');
  } else if (to.meta.role && user?.role !== to.meta.role) {
    // Role-based redirection
    if (user?.role === "admin") next('/admin-dashboard');
    else if (user?.role === "owner") next('/owner-dashboard');
    else next('/dashboard');
  } else {
    next();
  }
});

export default router;
