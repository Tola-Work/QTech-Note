<template>
  <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
    <div class="flex-1">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search notes..."
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        @input="handleSearch"
      />
    </div>
    
    <div class="flex space-x-4">
      <select
        v-model="sortBy"
        class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        @change="handleSearch"
      >
        <option value="updatedAt">Last Updated</option>
        <option value="createdAt">Created Date</option>
        <option value="title">Title</option>
      </select>
      
      <button
        @click="toggleSortOrder"
        class="px-3 py-2 border border-gray-300 rounded-md"
        :title="sortOrder === 'asc' ? 'Ascending' : 'Descending'"
      >
        <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NoteSearchParams } from '../types/notes.types'
import { debounce } from '@/utils/helpers'

const emit = defineEmits<{
  (e: 'search', params: NoteSearchParams): void
}>()

const searchQuery = ref('')
const sortBy = ref<NoteSearchParams['sortBy']>('updatedAt')
const sortOrder = ref<NoteSearchParams['sortOrder']>('desc')

const handleSearch = debounce(() => {
  emit('search', {
    query: searchQuery.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })
}, 300)

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  handleSearch()
}

watch([sortBy, sortOrder], handleSearch)
</script> 