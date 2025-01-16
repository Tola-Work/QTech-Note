<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold text-gray-900 truncate">{{ note.title }}</h3>
      <div class="flex space-x-2">
        <button
          @click="$emit('edit', note)"
          class="text-gray-500 hover:text-primary-600"
        >
          <span class="sr-only">Edit</span>
          <i class="fas fa-edit"></i>
        </button>
        <button
          @click="handleDelete"
          class="text-gray-500 hover:text-red-600"
        >
          <span class="sr-only">Delete</span>
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <p class="text-gray-600 text-sm mb-3 line-clamp-3">
      {{ note.content }}
    </p>
    
    <div class="flex justify-between text-xs text-gray-500">
      <span>Created: {{ formatDate(note.createdAt) }}</span>
      <span>Updated: {{ formatDate(note.updatedAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/date'
import type { Note } from '../types/notes.types'

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  (e: 'edit', note: Note): void
  (e: 'delete', id: string): void
}>()

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this note?')) {
    emit('delete', props.note.id)
  }
}
</script> 