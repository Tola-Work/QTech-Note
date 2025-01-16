<template>
  <div class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-lg font-semibold text-gray-900">{{ note.title }}</h3>
      <div class="flex gap-2">
        <button 
          @click="$emit('edit', note)"
          class="text-gray-600 hover:text-blue-600"
        >
          <i class="fas fa-edit"></i>
        </button>
        <button 
          @click="$emit('delete', note.noteId)"
          class="text-gray-600 hover:text-red-600"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <p class="text-gray-600 mb-3 line-clamp-3">{{ note.content }}</p>
    
    <div class="text-sm text-gray-500">
      <div>Updated: {{ formatDate(note.updatedAt) }}</div>
      <div>Created: {{ formatDate(note.createdAt) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { Note } from '../types/notes.types'

defineProps<{
  note: Note
}>()

defineEmits<{
  (e: 'edit', note: Note): void
  (e: 'delete', id: number): void
}>()

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}
</script> 