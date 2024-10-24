
import Home from '@/views/homepage.vue';
import Login from './components/login.vue';
import singup from './components/singup.vue';

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter ({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: singup
    },
  ],
});



export default router;
