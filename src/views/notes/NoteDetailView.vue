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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchNoteById, updateNote, deleteNote } from '@/store/slices/notesSlice'
import Button from '@/components/ui/Button.vue'
import NoteForm from '@/features/notes/components/NoteForm.vue'
import type { NoteFormData } from '@/features/notes/types/notes.types'

const route = useRoute()
const router = useRouter()
const dispatch = useAppDispatch()

const loading = ref(false)
const saving = ref(false)
const error = ref('')

const note = useAppSelector(state => state.notes.selectedNote)

const handleUpdate = async (data: NoteFormData) => {
  if (!note) return

  try {
    saving.value = true
    await dispatch(updateNote({ id: note.id, ...data }))
  } catch (err) {
    error.value = 'Failed to update note'
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  if (!note || !confirm('Are you sure you want to delete this note?')) return

  try {
    await dispatch(deleteNote(note.id))
    router.push('/')
  } catch (err) {
    error.value = 'Failed to delete note'
  }
}

onMounted(async () => {
  const noteId = route.params.id as string
  if (!noteId) return

  try {
    loading.value = true
    await dispatch(fetchNoteById(noteId))
  } catch (err) {
    error.value = 'Failed to fetch note'
  } finally {
    loading.value = false
  }
})
</script> 