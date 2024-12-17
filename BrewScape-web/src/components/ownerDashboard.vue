<template>
  <div v-if="isAuthenticated" class="ownerDashboard">
    <!-- Log Out Button -->
    <button class="logout-btn" @click="logOut">Log Out</button>

    <!-- Dashboard Summary Section -->
    <div class="dashboard-summary">
      <div class="card">
        <h2>Total Orders</h2>
        <p>{{ orders.length }}</p>
      </div>
      <div class="card">
        <h2>Total Sales</h2>
        <p>₱{{ totalSales }}</p>
      </div>
    </div>

    <!-- Order Management Section -->
    <h2>Manage Orders</h2>
    <table class="inventory-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Order Date</th>
          <th>User</th>
          <th>Total Amount</th>
          <th>Payment Method</th>
          <th>Items</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.date }}</td>
          <td>{{ order.user }}</td>
          <td>₱{{ order.totalAmount }}</td>
          <td>{{ order.paymentMethod }}</td>
          <td>
            <ul>
              <li v-for="item in order.items" :key="item.name">
                {{ item.name }} (₱{{ item.price }} x {{ item.quantity }})
              </li>
            </ul>
          </td>
          <td>
            <button class="edit-btn" @click="editOrder(order)">Edit</button>
            <button class="delete-btn" @click="deleteOrder(order.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Transaction History Section -->
    <h2>User Transaction History</h2>
    <div v-for="(userOrders, user) in userTransactionHistory" :key="user">
      <h3>{{ user }}</h3>
      <table class="transaction-history-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in userOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.date }}</td>
            <td>₱{{ order.totalAmount }}</td>
            <td>{{ order.paymentMethod }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Order Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ editMode ? 'Edit Order' : 'Add New Order' }}</h3>
        <form @submit.prevent="saveOrder">
          <label for="itemName">Item Name:</label>
          <input type="text" id="itemName" v-model="formOrder.itemName" required />

          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" v-model="formOrder.quantity" required />

          <label for="status">Status:</label>
          <input type="text" id="status" v-model="formOrder.status" required />

          <button type="submit">{{ editMode ? 'Update' : 'Add' }}</button>
          <button type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
  <div v-else>
    <h1>Please log in to access the Owner Dashboard.</h1>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';  // Import signOut from Firebase
import { useRouter } from 'vue-router';  // Import vue-router's useRouter function
import { db, collection, query, where, getDocs } from '../firebase.config'; // Firebase imports

export default {
  name: 'OwnerDashboard',
  setup() {
    const router = useRouter();  // Initialize Vue Router
    const isAuthenticated = ref(false);
    const orders = ref([]);  // Array to store fetched orders
    const totalSales = ref(0); // Dynamic total sales
    const showModal = ref(false);
    const editMode = ref(false);
    const formOrder = reactive({ id: null, itemName: '', quantity: '', status: '' });
    const userTransactionHistory = ref({}); // Store user transaction history

    onMounted(async () => {
      // Get current authenticated user
      const auth = getAuth();
      const user = auth.currentUser;

      // Check if the user is authenticated
      if (user) {
        // Check if the user is an owner
        const ownerRef = query(collection(db, 'owners'), where('email', '==', user.email));
        const ownerSnapshot = await getDocs(ownerRef);

        if (!ownerSnapshot.empty) {
          isAuthenticated.value = true;

          // Fetch orders for the authenticated owner
          const ordersSnapshot = await getDocs(collection(db, "orders"));
          orders.value = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Calculate total sales from orders
          totalSales.value = orders.value.reduce((sum, order) => sum + order.totalAmount, 0);

          // Organize orders by user for transaction history
          const history = {};
          orders.value.forEach(order => {
            if (!history[order.user]) {
              history[order.user] = [];
            }
            history[order.user].push(order);
          });
          userTransactionHistory.value = history;
        } else {
          isAuthenticated.value = false;
        }
      }
    });

    const logOut = () => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          isAuthenticated.value = false;  // Update authentication status
          router.push('/');  // Redirect to the login page
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
        // Update the existing order
        const index = orders.value.findIndex((o) => o.id === formOrder.id);
        if (index !== -1) orders.value[index] = { ...formOrder };
      } else {
        // Add a new order
        const newOrder = { ...formOrder, id: Date.now() };  // Temporarily use Date.now() as ID
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
      orders,  // Use orders from Firestore
      totalSales,
      showModal,
      formOrder,
      editMode,
      openAddOrderModal,
      editOrder,
      saveOrder,
      deleteOrder,
      closeModal,
      userTransactionHistory,  // Bind the user transaction history
      logOut,  // Log out function
    };
  },
};
</script>

<style scoped>
.ownerDashboard {
  padding: 20px;
  background-color: #ffffff; /* Light brown color */
}

.logout-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #4b2d1f;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.dashboard-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  padding: 15px;
  background-color: #f8e2c2;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 150px;
}

.card h2 {
  margin-bottom: 5px;
}

.inventory-table, .transaction-history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.inventory-table th, .transaction-history-table th {
  text-align: left;
  padding: 8px;
  background-color: #f8e2c2;
}

.inventory-table td, .transaction-history-table td {
  padding: 8px;
}

.edit-btn, .delete-btn {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background-color: #dc3545;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-bottom: 5px;
}

form input {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

form button {
  padding: 10px;
  border-radius: 4px;
  background-color: #4b2d1f;
  color: white;
  cursor: pointer;
}

form button[type="button"] {
  background-color: #ccc;
}
</style>
