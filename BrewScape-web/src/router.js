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
import { db } from "./firebase.config";  // Assuming Firebase is initialized here
import { doc, getDoc } from "firebase/firestore";

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
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/admin-login",
    name: "AdminLogin",
    component: AdminLogin,
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
  },
  {
    path: "/owner-dashboard",
    name: "OwnerDashboard",
    component: OwnerDashboard,
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

  // Avoid unnecessary redirects
  if (to.path === from.path) {
    return next(); // Prevent navigating to the same route
  }

  // Authentication check
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login'); // Redirect to login if not authenticated
  }

  // Admin login flow
  if (to.path === '/admin-login') {
    if (isAuthenticated) {
      // Check if the authenticated user is an admin
      const docRef = doc(db, 'admins', user.email);  // Assuming email is the document ID for admin users
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().role === 'admin') {
        return next(); // Allow access to the admin login page if the user is an admin
      } else {
        return next('/login'); // Redirect to regular login if the user is not an admin
      }
    } else {
      return next(); // Allow access to the admin login page if not authenticated
    }
  }

  // Role-based redirection for authenticated users
  if (to.meta.role && user && user.role !== to.meta.role) {
    // Redirect to the appropriate dashboard based on the user's role
    if (user.role === "admin") {
      return next('/admin-dashboard');
    }
    if (user.role === "owner") {
      return next('/owner-dashboard');
    }
    return next('/dashboard'); // Default to user dashboard if role mismatches
  }

  // If the user is authenticated and tries to access the login page, redirect based on their role
  if (to.path === '/login' && isAuthenticated) {
    if (user?.role === "admin") {
      return next('/admin-dashboard');
    }
    if (user?.role === "owner") {
      return next('/owner-dashboard');
    }
    return next('/dashboard'); // Redirect authenticated users to their dashboard
  }

  next(); // Continue to the route if all checks pass
});

export default router;
