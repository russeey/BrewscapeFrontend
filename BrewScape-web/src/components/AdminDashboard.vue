<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <nav>
        <router-link to="/admin-users" :class="{ active: isActive('/admin-users') }">Manage Users</router-link>
        <router-link to="/admin-reports" :class="{ active: isActive('/admin-reports') }">View Reports</router-link>
        <router-link to="/admin-settings" :class="{ active: isActive('/admin-settings') }">Settings</router-link>
      </nav>
    </header>
    <main class="dashboard-content">
      <section>
        <h2>Welcome, {{ adminName }}!</h2>
        <p>This is your dashboard where you can manage the application.</p>
      </section>
      <section>
        <h3>Statistics</h3>
        <p>Here you can view various statistics related to the application.</p>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter();
    const adminName = ref('');
    const currentRoute = ref(router.currentRoute.value.path);

    onMounted(async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        router.push('/admin-login');
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        // Check if the user is an admin
        if (adminDoc.exists()) {
          adminName.value = adminDoc.data().firstName; // Set admin name
        } else if (userDoc.exists()) {
          // If the user is a regular user, redirect them to their user dashboard
          router.push('/user-dashboard');
          return;
        } else {
          console.error('No data found for this user.');
          router.push('/admin-login');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
        router.push('/admin-login');
      }
    });

    const isActive = (route) => {
      return currentRoute.value === route;
    };

    return {
      adminName,
      isActive,
    };
  },
};
</script>


<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f5f5;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4b2d1f;
  color: white;
  padding: 10px;
}

.dashboard-content {
  margin-top: 20px;
}

nav a {
  margin-right: 15px;
  color: #4b2d1f;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

nav a.active {
  font-weight: bold;
  color: #fbe5c7;
}
</style>
