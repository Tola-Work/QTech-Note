<template>
  <header class="bg-white border-b px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-gray-900">QTech Note</h1>
        <span class="ml-2 text-sm text-blue-600">(Dev)</span>
      </div>
      
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">Welcome, User</span>
        <button 
          @click="$emit('logout')" 
          class="text-sm text-gray-600 hover:text-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'logout'): void
}>()
</script> 