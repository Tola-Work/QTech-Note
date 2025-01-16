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

      <!-- Add this at the bottom of aside -->
      <div class="p-4 border-t mt-auto">
        <button 
          @click="handleLogout" 
          class="w-full flex items-center px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg"
        >
          <ArrowLeftOnRectangleIcon class="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1">
      <router-view 
        v-bind="{
          notes,
          loading,
          error,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages
        }"
        @page-change="handlePageChange"
        @search="handleSearch"
        @sort="handleSort"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNotes, clearNotes } from "@/store/slices/notesSlice";
import { MagnifyingGlassIcon, DocumentTextIcon, ArrowLeftOnRectangleIcon } from "@heroicons/vue/24/outline";
import { debounce } from "@/utils/helpers";
import type { NoteSearchParams } from "@/features/notes/types/notes.types";
import { useRouter } from 'vue-router';
import { logout } from "@/store/slices/authSlice";

const dispatch = useAppDispatch();
const router = useRouter();

// Use separate selectors for better performance
const notes = useAppSelector((state) => state.notes.items);
const loading = useAppSelector((state) => state.notes.loading);
const error = useAppSelector((state) => state.notes.error);
const pagination = useAppSelector((state) => state.notes.pagination);

// Local state only for UI controls
const searchQuery = ref("");
const sortBy = ref("lastUpdated");

const sortOptions = [
  { label: "Last Updated", value: "lastUpdated" },
  { label: "Created Date", value: "created" },
  { label: "Title", value: "title" },
];

// Handlers
const fetchNotesList = async (params: NoteSearchParams) => {
  try {
    await dispatch(fetchNotes(params)).unwrap();
  } catch (err: any) {
    console.error('Fetch error:', err);
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

// Add logout handler
const handleLogout = async () => {
  await dispatch(logout());
  router.push('/auth/login');
};
</script> 