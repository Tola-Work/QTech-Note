<template>
  <div class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-lg font-semibold text-gray-900">{{ note.title }}</h3>
      <div class="flex gap-2">
        <button 
          @click="$emit('edit', note)"
          class="text-gray-600 hover:text-blue-600"
        >
          <PencilSquareIcon class="w-5 h-5" />
        </button>
        <button 
          @click="$emit('delete', note.noteId)"
          class="text-gray-600 hover:text-red-600"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <p class="text-gray-600 mb-3 line-clamp-3">{{ note.content }}</p>
    
    <div class="text-sm text-gray-500">
      <div>Updated: {{ formatDateToCambodia(note.updatedAt) }}</div>
      <div>Created: {{ formatDateToCambodia(note.createdAt) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, parseISO, addHours } from 'date-fns'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { Note } from '../types/notes.types'

defineProps<{
  note: Note
}>()

defineEmits<{
  (e: 'edit', note: Note): void
  (e: 'delete', id: number): void
}>()

// Function to format UTC date to Cambodia time (UTC+7)
const formatDateToCambodia = (dateString: string) => {
  try {
    // Parse the ISO string to Date object
    const date = parseISO(dateString)
    
    // Add 7 hours to convert to Cambodia time
    const cambodiaDate = addHours(date, 7)
    
    // Format the date in a readable format with 12-hour time (AM/PM)
    return format(cambodiaDate, 'MMM dd, yyyy hh:mm a')
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid date'
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 