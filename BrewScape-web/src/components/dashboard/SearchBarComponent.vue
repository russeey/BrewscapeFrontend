<template>
  <div class="search-bar">
    <div class="search-input-container">
      <input 
        type="text" 
        class="search-input" 
        placeholder="Search menu items..." 
        :value="searchTerm"
        @input="$emit('input', $event.target.value)"
      />
      <span class="search-icon">🔍</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBarComponent',
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  emits: ['input']
}
</script>

<style scoped>
.search-bar {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-input-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 20px;
  font-size: 16px;
  border: 2px solid #bd8e50;
  border-radius: 25px;
  outline: none;
  transition: all 0.3s ease;
  background-color: white;
}

.search-input:focus {
  border-color: #8b4513;
  box-shadow: 0 0 10px rgba(189, 142, 80, 0.2);
}

.search-input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #bd8e50;
  pointer-events: none;
}
</style>
