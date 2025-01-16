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
            @click="handleSort(option.value)"
            :class="[
              'w-full text-left px-3 py-2 rounded text-sm',
              sortBy === option.value
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
      <router-view 
        v-bind="{
          notes: notesState.items || [],
          loading: notesState.loading,
          error: notesState.error,
          currentPage: notesState.pagination.currentPage,
          totalPages: notesState.pagination.totalPages
        }"
        @page-change="handlePageChange"
        @search="handleSearch"
        @sort="handleSort"
      />
    </div>

    <!-- Debug info -->
    <div v-if="true" class="fixed bottom-4 right-4 p-4 bg-white shadow rounded max-w-md overflow-auto max-h-96">
      <pre class="text-xs">
Store State:
{{ JSON.stringify(notesState, null, 2) }}

Local State:
{{ JSON.stringify({
  loading: loading,
  error: error,
  searchQuery: searchQuery,
  sortBy: sortBy
}, null, 2) }}
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNotes, clearNotes } from "@/store/slices/notesSlice";
import { MagnifyingGlassIcon, DocumentTextIcon } from "@heroicons/vue/24/outline";
import { debounce } from "@/utils/helpers";
import type { NoteSearchParams } from "@/features/notes/types/notes.types";

const dispatch = useAppDispatch();

// State
const loading = ref(false);
const error = ref("");
const searchQuery = ref("");
const sortBy = ref("lastUpdated");

const sortOptions = [
  { label: "Last Updated", value: "lastUpdated" },
  { label: "Created Date", value: "created" },
  { label: "Title", value: "title" },
];

// Store selector
const notesState = useAppSelector((state) => {
  console.log('Current store state:', state.notes);
  return state.notes;
});

// Watch store changes
watch(() => notesState.items, (newItems) => {
  console.log('Notes items changed:', newItems);
}, { deep: true });

// Handlers
const fetchNotesList = async (params: NoteSearchParams) => {
  try {
    loading.value = true;
    error.value = "";
    const result = await dispatch(fetchNotes(params)).unwrap();
    console.log('Fetch completed, result:', result);
  } catch (err: any) {
    console.error('Fetch error:', err);
    error.value = err.message || "Failed to fetch notes";
  } finally {
    loading.value = false;
  }
};

const handleSearch = debounce(() => {
  fetchNotesList({
    Page: 1,
    PageSize: 10,
  });
}, 300);

const handleSort = (sort: string) => {
  sortBy.value = sort;
  fetchNotesList({
    Page: 1,
    PageSize: 10,
  });
};

const handlePageChange = (page: number) => {
  fetchNotesList({
    Page: page,
    PageSize: 10,
  });
};

// Initial fetch
onMounted(async () => {
  console.log('Component mounted, fetching notes...');
  try {
    const result = await dispatch(fetchNotes({
      Page: 1,
      PageSize: 10,
    })).unwrap();
    console.log('Initial fetch result:', result);
  } catch (error) {
    console.error('Initial fetch failed:', error);
  }
});

// Cleanup on unmount
onUnmounted(() => {
  dispatch(clearNotes());
});
</script> 