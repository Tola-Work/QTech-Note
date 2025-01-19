<template>
  <div ref="containerRef" class="transition-opacity duration-200">
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="error" class="text-red-600 text-center py-8">
      {{ error }}
    </div>

    <div v-else-if="!notes || notes.length === 0" class="text-gray-500 text-center py-8">
      No notes found. Create your first note!
    </div>

    <div v-else :class="[
      'grid gap-3 sm:gap-4 transition-all duration-200',
      view === 'grid' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4' 
        : 'grid-cols-1'
    ]">
      <NoteCard
        v-for="note in notes"
        :key="note.noteId"
        :note="note"
        :view="view"
        @edit="$emit('edit', note)"
        @delete="$emit('delete', note.noteId)"
      />
    </div>

    
  </div>
</template>

<script setup lang="ts">
import NoteCard from "./NoteCard.vue";
import type { Note } from "../types/notes.types";
import { ref, nextTick, watchEffect } from 'vue';

const containerRef = ref<HTMLElement | null>(null);

defineProps<{
  notes: Note[];
  loading?: boolean;
  error?: string | null;
  view?: 'grid' | 'list';
}>();

defineEmits<{
  (e: "edit", note: Note): void;
  (e: "delete", id: number): void;
}>();


watchEffect(() => {
  if (containerRef.value) {
    containerRef.value.style.opacity = '0';
    nextTick(() => {
      containerRef.value!.style.opacity = '1';
    });
  }
});
</script>
