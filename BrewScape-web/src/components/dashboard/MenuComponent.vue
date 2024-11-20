<template>
  <div class="menu">
    <h2>{{ title }}</h2>
    <ul>
      <li 
        v-for="item in items" 
        :key="item.name"
        :class="{ highlighted: isHighlighted(item.name) }"
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
  methods: {
    isHighlighted(itemName) {
      return itemName.toLowerCase().includes(this.searchTerm.toLowerCase());
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
}

.highlighted {
  background-color: #ffeb3b;
}
</style>
