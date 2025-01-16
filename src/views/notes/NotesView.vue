<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Notes</h1>
    </div>

    <NoteList
      :notes="notes"
      :loading="loading"
      :error="error"
      @edit="handleEditNote"
      @delete="handleDeleteNote"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchNotes, deleteNote } from '@/store/slices/notesSlice'
import NoteList from '@/features/notes/components/NoteList.vue'
import type { Note } from '@/features/notes/types/notes.types'

const router = useRouter()
const dispatch = useAppDispatch()
const loading = ref(false)
const error = ref('')

const notes = useAppSelector(state => state.notes.items)

const handleEditNote = (note: Note) => {
  router.push(`/notes/${note.id}`)
}

const handleDeleteNote = async (id: string) => {
  try {
    await dispatch(deleteNote(id))
  } catch (err) {
    error.value = 'Failed to delete note'
  }
}

onMounted(async () => {
  try {
    loading.value = true
    await dispatch(fetchNotes())
  } catch (err) {
    error.value = 'Failed to fetch notes'
  } finally {
    loading.value = false
  }
})
</script> 