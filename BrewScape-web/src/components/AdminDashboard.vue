<template>
  <div class="dashboard" v-if="isAuthenticated">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <button @click="logOut" class="logout-btn">Logout</button>
    </header>

    <div v-if="showNotification" class="notification">You have logged out successfully!</div>

    <main class="dashboard-content">
      <section class="welcome-section">
      </section>

      <!-- Centered Statistics with Border -->
      <section class="statistics-section">
        <h3>Statistics</h3>
        <p>Total Sales: ₱{{ totalSales.toFixed(2) }}</p>
      </section>

      <section class="orders-management">
        <h3>Manage Orders</h3>
        <button @click="openAddOrderModal" class="add-order-btn">Add Order</button>
        <div v-if="orders.length" class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-item">
            <span>{{ order.itemName }} ({{ order.quantity }})</span>
            <button @click="editOrder(order)" class="edit-btn">Edit</button>
            <button @click="deleteOrder(order.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </section>

      <!-- Modal for adding or editing orders -->
      <div v-if="showModal" class="modal">
        <h3>{{ editMode ? 'Edit' : 'Add' }} Order</h3>
        <form @submit.prevent="saveOrder">
          <label for="itemName">Item Name:</label>
          <input v-model="formOrder.itemName" type="text" required />
          <label for="quantity">Quantity:</label>
          <input v-model="formOrder.quantity" type="number" required />
          <label for="status">Status:</label>
          <input v-model="formOrder.status" type="text" required />
          <button type="submit">{{ editMode ? 'Save Changes' : 'Add Order' }}</button>
          <button type="button" @click="closeModal" class="close-btn">Close</button>
        </form>
      </div>
    </main>
  </div>

  <!-- Not authenticated message -->
  <div v-else>
    <h1>You are not authorized to view this page.</h1>
    <router-link to="/login">Go to Login</router-link>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth'; 
import { useRouter } from 'vue-router'; 
import { db, collection, query, where, getDocs } from '@/firebase.config'; 

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter();  
    const isAuthenticated = ref(false);
    const adminName = ref('');
    const orders = ref([]);  
    const totalSales = ref(0); 
    const showModal = ref(false);
    const editMode = ref(false);
    const formOrder = reactive({ id: null, itemName: '', quantity: '', status: '' });
    const showNotification = ref(false);

    onMounted(async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const adminRef = query(collection(db, 'admins'), where('email', '==', user.email));
        const adminSnapshot = await getDocs(adminRef);

        if (!adminSnapshot.empty) {
          isAuthenticated.value = true;
          adminName.value = user.displayName;

          const ordersSnapshot = await getDocs(collection(db, "orders"));
          orders.value = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          totalSales.value = orders.value.reduce((sum, order) => sum + order.totalAmount, 0);
        } else {
          isAuthenticated.value = false;
        }
      } else {
        isAuthenticated.value = false;
      }
    });

    const logOut = () => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          isAuthenticated.value = false;
          router.push('/');  
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    };

    const openAddOrderModal = () => {
      editMode.value = false;
      Object.assign(formOrder, { id: null, itemName: '', quantity: '', status: '' });
      showModal.value = true;
    };

    const editOrder = (order) => {
      editMode.value = true;
      Object.assign(formOrder, order);
      showModal.value = true;
    };

    const saveOrder = () => {
      if (editMode.value) {
        const index = orders.value.findIndex((o) => o.id === formOrder.id);
        if (index !== -1) orders.value[index] = { ...formOrder };
      } else {
        const newOrder = { ...formOrder, id: Date.now() };
        orders.value.push(newOrder);
      }
      closeModal();
    };

    const deleteOrder = (id) => {
      orders.value = orders.value.filter((order) => order.id !== id);
    };

    const closeModal = () => {
      showModal.value = false;
    };

    return {
      isAuthenticated,
      adminName,
      orders,
      totalSales,
      showModal,
      formOrder,
      editMode,
      openAddOrderModal,
      editOrder,
      saveOrder,
      deleteOrder,
      closeModal,
      logOut,
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
  padding: 15px;
}

.dashboard-header h1 {
  font-size: 1.8em;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.dashboard-content {
  margin-top: 20px;
}

.welcome-section,
.orders-management {
  margin-bottom: 30px;
}

.orders-list {
  margin-top: 10px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 5px;
}

.order-item button {
  margin-left: 10px; 
}

button {
  padding: 6px 12px;
  font-size: 0.9em;
  cursor: pointer;
}

.add-order-btn,
.edit-btn,
.delete-btn {
  background-color: #4b2d1f;
  color: white;
  border: none;
  border-radius: 5px;
}

.add-order-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  background-color: #fbe5c7;
}

/* Centered Statistics Section */
.statistics-section {
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border: 2px solid #4b2d1f; 
  border-radius: 10px;
  text-align: center;
  width: 50%;
}

.statistics-section h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.statistics-section p {
  font-size: 1.2em;
  font-weight: bold;
  color: #4b2d1f;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close-btn {
  background-color: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #4caf50;
  color: white;
  padding: 20px;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
