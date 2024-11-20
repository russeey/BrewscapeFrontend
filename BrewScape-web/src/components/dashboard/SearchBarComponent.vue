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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
}

.search-input-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 8px 35px 8px 15px;
  font-size: 15px;
  border: 2px solid #bd8e50;
  border-radius: 20px;
  outline: none;
  transition: all 0.3s ease;
  background-color: transparent;
}

.search-input:focus {
  border-color: #8b4513;
  box-shadow: 0 0 8px rgba(189, 142, 80, 0.2);
  transform: translateY(-1px);
}

.search-input::placeholder {
  color: #999;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #bd8e50;
  pointer-events: none;
}
</style>
