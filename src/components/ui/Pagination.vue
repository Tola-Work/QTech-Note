<template>
  <nav class="flex items-center gap-2">
    <button
      v-for="page in totalPages"
      :key="page"
      :class="[
        'px-3 py-1 rounded text-sm',
        currentPage === page
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      ]"
      @click="$emit('change', page)"
    >
      {{ page }}
    </button>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  (e: 'change', page: number): void
}>()
</script> 