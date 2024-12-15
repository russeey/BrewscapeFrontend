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
    path: '/admin-login',
    name: 'AdminLogin',
    component: () => import('@/components/admin-login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/owner-login',
    name: 'OwnerLogin',
    component: () => import('@/components/owner-login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/owner-dashboard',
    name: 'ownerDashboard',
    component: () => import('@/components/ownerDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: () => import('@/components/AdminDashboard.vue'),
    meta: { requiresAuth: true }
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

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdminAuthenticated = !!localStorage.getItem('adminId');
  const isOwnerAuthenticated = !!localStorage.getItem('ownerId');

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // Handle routes that require admin authentication
  if (to.meta.requiresAuth && to.name === 'AdminDashboard' && !isAdminAuthenticated) {
    next('/admin-login');
    return;
  }

  // Handle routes that require owner authentication
  if (to.meta.requiresAuth && to.name === 'ownerDashboard' && !isOwnerAuthenticated) {
    next('/owner-login');
    return;
  }

  // Handle routes that require guest access (like login page)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard');
    return;
  }

  // Handle routes that require guest access (like admin login page)
  if (to.meta.requiresGuest && to.name === 'AdminLogin' && isAdminAuthenticated) {
    next('/admin-dashboard');
    return;
  }

  // Handle routes that require guest access (like owner login page)
  if (to.meta.requiresGuest && to.name === 'OwnerLogin' && isOwnerAuthenticated) {
    next('/owner-dashboard');
    return;
  }

  next();
});

export default router;
