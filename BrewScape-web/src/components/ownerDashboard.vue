<template>
  <div v-if="isAuthenticated" class="ownerDashboard">
    <!-- Owner Dashboard Content Goes Here -->
    <h1>Welcome to the Owner Dashboard</h1>
    <!-- Add more dashboard components or content as needed -->
  </div>
  <div v-else>
    <h1>Please log in to access the Owner Dashboard.</h1>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'OwnerDashboard',
  setup() {
    const isAuthenticated = ref(false);

    onMounted(() => {
      // Check if ownerId exists in localStorage
      isAuthenticated.value = !!localStorage.getItem('ownerId');
    });

    return {
      isAuthenticated,
    };
  },
};
</script>

<style scoped>
.ownerDashboard {
  padding: 20px;
  /* Add your styles for the owner dashboard here */
}
</style>

