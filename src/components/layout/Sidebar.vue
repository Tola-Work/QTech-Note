<template>
  <aside class="w-64 bg-white shadow-md">
    <div class="h-full px-3 py-4 overflow-y-auto">
      <div class="space-y-2">
        <Button
          variant="primary"
          class="w-full"
          @click="$emit('new-note')"
        >
          <i class="fas fa-plus mr-2"></i>
          New Note
        </Button>

        <div class="pt-4">
          <NoteSearch @search="$emit('search', $event)" />
        </div>

        <nav class="mt-4">
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': $route.name === 'notes' }"
              >
                <i class="fas fa-list-ul w-6"></i>
                <span>All Notes</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import NoteSearch from '@/features/notes/components/NoteSearch.vue'
import type { NoteSearchParams } from '@/features/notes/types/notes.types'

defineEmits<{
  (e: 'new-note'): void
  (e: 'search', params: NoteSearchParams): void
}>()
</script> 