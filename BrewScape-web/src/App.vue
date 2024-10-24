<script setup>
import Homepage from './components/homepage.vue'
import login from './components/login.vue';
import { RouterView } from "vue-router";
</script>

<template>
  <Homepage/>
  <login/>
  <RouterView/>
</template>