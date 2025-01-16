<template>
  <div class="min-h-screen bg-gray-100">
    <Header />
    <div class="flex">
      <Sidebar
        @new-note="showNewNoteModal = true"
        @search="handleSearch"
      />
      <main class="flex-1 p-6">
        <router-view></router-view>
      </main>
    </div>

    <Modal
      v-model="showNewNoteModal"
      title="Create New Note"
      :close-on-backdrop="false"
    >
      <NoteForm
        :loading="loading"
        @submit="handleCreateNote"
        @cancel="showNewNoteModal = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDispatch } from '@/store/hooks'
import { createNote } from '@/store/slices/notesSlice'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Modal from '@/components/ui/Modal.vue'
import NoteForm from '@/features/notes/components/NoteForm.vue'
import type { NoteFormData } from '@/features/notes/types/notes.types'
import type { NoteSearchParams } from '@/features/notes/types/notes.types'

const router = useRouter()
const dispatch = useAppDispatch()
const showNewNoteModal = ref(false)
const loading = ref(false)

const handleCreateNote = async (data: NoteFormData) => {
  try {
    loading.value = true
    const result = await dispatch(createNote(data))
    showNewNoteModal.value = false
    router.push(`/notes/${result.payload.id}`)
  } catch (error) {
    console.error('Failed to create note:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = (params: NoteSearchParams) => {
  router.push({
    name: 'notes',
    query: {
      ...params,
      page: '1'
    }
  })
}
</script> 