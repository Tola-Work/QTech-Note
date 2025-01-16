<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r flex flex-col shrink-0">
      <!-- Search Section -->
      <div class="p-4 border-b">
        <div class="relative">
          <input
            type="text"
            placeholder="Search notes..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            v-model="searchQuery"
            @input="handleSearch"
          />
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <!-- Sort Options -->
      <div class="p-4 border-b">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Sort By</h3>
        <div class="space-y-2">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="$emit('sort', option.value)"
            :class="[
              'w-full text-left px-3 py-2 rounded text-sm',
              activeSort === option.value
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <router-link
          to="/"
          class="flex items-center px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
          :class="{ 'bg-gray-100': $route.name === 'notes' }"
        >
          <DocumentTextIcon class="w-5 h-5 mr-3" />
          All Notes
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { MagnifyingGlassIcon, DocumentTextIcon } from "@heroicons/vue/24/outline";
import { debounce } from "@/utils/helpers";
import type { NoteSearchParams } from "@/features/notes/types/notes.types";

const props = defineProps<{
  activeSort: string
}>();

const emit = defineEmits<{
  (e: "search", params: NoteSearchParams): void;
  (e: "sort", sort: string): void;
}>();

const searchQuery = ref("");

const sortOptions = [
  { label: "Last Updated", value: "lastUpdated" },
  { label: "Created Date", value: "created" },
  { label: "Title", value: "title" },
];

const handleSearch = debounce(() => {
  emit("search", {
    Page: 1,
    PageSize: 10,
  });
}, 300);

watch(searchQuery, handleSearch);
</script> 