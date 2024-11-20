<template>
  <div class="menu">
    <h2>{{ title }}</h2>
    <ul>
      <li 
        v-for="item in filteredItems" 
        :key="item.name"
      >
        {{ item.name }} - {{ item.price }}₱
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MenuComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    searchTerm: {
      type: String,
      default: ''
    }
  },
  computed: {
    filteredItems() {
      if (!this.searchTerm) return this.items;
      const search = this.searchTerm.toLowerCase();
      return this.items.filter(item => 
        item.name.toLowerCase().includes(search)
      );
    }
  }
}
</script>

<style scoped>
.menu {
  flex: 3;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.menu h2 {
  font-size: 22px;
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
}

.menu ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

.menu ul li {
  flex: 1;
  min-width: 450px;
  max-width: 450px;
  padding: 15px;
  background-color: #fafafa;
  margin-bottom: 10px;
  border-radius: 70px;
  border: 1px solid #e0e0e0;
  font-size: 18px;
  color: #444;
  box-shadow: none;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.menu ul li:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
