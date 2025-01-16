<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
      />
    </div>

    <div>
      <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
      <textarea
        id="content"
        v-model="form.content"
        rows="4"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
      ></textarea>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        {{ loading ? 'Saving...' : submitButtonText }}
      </button>
    </div>

    <div v-if="error" class="text-red-600 text-sm">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Note, NoteFormData } from '../types/notes.types'

const props = defineProps<{
  initialData?: Note
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: NoteFormData): void
  (e: 'cancel'): void
}>()

const form = ref<NoteFormData>({
  title: props.initialData?.title || '',
  content: props.initialData?.content || ''
})

const error = ref('')

const submitButtonText = computed(() => {
  return props.initialData ? 'Update Note' : 'Create Note'
})

const handleSubmit = () => {
  error.value = ''
  emit('submit', form.value)
}
</script> 