<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="text-red-600 text-center py-8">
      {{ error }}
    </div>

    <template v-else>
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">{{ note?.title }}</h1>
        <div class="flex space-x-4">
          <Button variant="secondary" @click="router.back()">Back</Button>
          <Button variant="danger" @click="handleDelete">Delete</Button>
        </div>
      </div>

      <NoteForm
        :initial-data="note"
        :loading="saving"
        @submit="handleUpdate"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore, useStoreState } from '@/composables/useStore'
import { useRoute, useRouter } from 'vue-router'
import type { NoteFormData } from '@/features/notes/types/notes.types'

const store = useStore()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const error = ref('')

const notesState = useStoreState('notes')
const note = computed(() => notesState.value.selectedNote)

const handleUpdate = async (data: NoteFormData) => {
  if (!note.value) return

  try {
    saving.value = true
    await store.dispatch('notes/updateNote', {
      id: note.value.noteId,
      ...data
    })
  } catch (err: any) {
    error.value = 'Failed to update note'
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  if (!note.value || !confirm('Are you sure you want to delete this note?')) return

  try {
    await store.dispatch('notes/deleteNote', note.value.noteId)
    router.push('/')
  } catch (err: any) {
    error.value = 'Failed to delete note'
  }
}

onMounted(async () => {
  const noteId = parseInt(route.params.id as string)
  if (noteId) {
    try {
      loading.value = true
      await store.dispatch('notes/fetchNoteById', noteId)
    } catch (err: any) {
      error.value = 'Failed to fetch note'
    } finally {
      loading.value = false
    }
  }
})
</script> 