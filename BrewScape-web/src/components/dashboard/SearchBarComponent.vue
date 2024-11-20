<template>
  <div class="search-bar">
    <input 
      type="text" 
      class="search-input" 
      placeholder="Search an Item..." 
      :value="searchTerm"
      @input="$emit('input', $event.target.value)"
    />
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
  }
}
</script>

<style scoped>
.search-bar {
  margin: 3px 0;
}

.search-input {
  width: 300px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #4b2d1f;
}
</style>
