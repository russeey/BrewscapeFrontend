import { createRouter, createWebHistory } from 'vue-router';
import authService from '@/services/authService';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/components/homepage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/components/signup.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/components/profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/components/cart.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
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
