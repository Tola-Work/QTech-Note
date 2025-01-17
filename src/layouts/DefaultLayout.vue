<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Mobile Menu Button - Only visible on mobile -->
    <button 
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-[1.35rem] left-4 z-20 p-1.5 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 bg-white"
    >
      <Bars3Icon class="h-5 w-5" v-if="!isSidebarOpen" />
      <XMarkIcon class="h-5 w-5" v-else />
    </button>

    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-white border-r flex flex-col flex-shrink-0',
        'transition-all duration-300 ease-in-out',
        'fixed lg:static inset-y-0 left-0 z-10',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'w-64'
      ]"
    >
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
          <div 
            v-if="searchQuery" 
            @click="searchQuery = ''; handleSearch()"
            class="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-5 h-5" />
          </div>
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
            class="w-full flex items-center justify-between px-3 py-2 rounded text-sm"
            :class="[
              sortBy === option.value
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <span>{{ option.label }}</span>
            <span v-if="sortBy === option.value" class="text-xs">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
        </div>
      </div>

   

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

    <!-- Overlay for mobile -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-0"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-hidden lg:ml-0">
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore, useStoreState } from '@/composables/useStore'
import { useRouter, useRoute } from 'vue-router'
import { MagnifyingGlassIcon, DocumentTextIcon, ArrowLeftOnRectangleIcon, XMarkIcon, Bars3Icon } from "@heroicons/vue/24/outline";
import { debounce } from "@/utils/helpers";
import type { NoteSearchParams } from "@/features/notes/types/notes.types";

const store = useStore()
const router = useRouter()

// Use the enhanced store state access
const notesState = useStoreState('notes')
const notes = computed(() => notesState.value.items)
const loading = computed(() => notesState.value.loading)
const error = computed(() => notesState.value.error)
const pagination = computed(() => notesState.value.pagination)

// Local state only for UI controls
const searchQuery = ref("");
const searchTimeout = ref<number | null>(null);
const sortBy = ref("UpdatedAt");
const sortOrder = ref<'asc' | 'desc'>('desc');

const sortOptions = [
  { label: "Last Updated", value: "UpdatedAt" },
  { label: "Created Date", value: "CreatedAt" },
  { label: "Title", value: "Title" },
];

// Handlers
const fetchNotesList = async (params: NoteSearchParams) => {
  try {
    console.log('Fetching with params:', {
      ...params,
      SortBy: sortBy.value,
      SortOrder: sortOrder.value
    });
    
    await store.dispatch('notes/fetchNotes', {
      ...params,
      SortBy: sortBy.value,
      SortOrder: sortOrder.value.toUpperCase(),
      Query: searchQuery.value
    })
  } catch (err: any) {
    console.error('Fetch error:', err)
  }
}

// Update search handler with proper debounce
const handleSearch = debounce(() => {
  if (searchQuery.value.trim() === '') {
    // If search is empty, fetch all notes
    fetchNotesList({
      Page: 1,
      PageSize: 10
    });
  } else {
    // If there's a search query, use search endpoint
    fetchNotesList({
      Page: 1,
      PageSize: 10,
      Query: searchQuery.value.trim()
    });
  }
}, 300);

const handleSort = (sort: string) => {
  console.log('Sort clicked:', sort);
  
  if (sortBy.value === sort) {
    // Toggle sort order if clicking the same sort option
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    console.log('Toggled sort order:', sortOrder.value);
  } else {
    // Set new sort field and default to descending order
    sortBy.value = sort;
    sortOrder.value = 'desc';
    console.log('New sort:', { field: sortBy.value, order: sortOrder.value });
  }
  
  fetchNotesList({
    Page: 1,
    PageSize: 10
  });
}

const handlePageChange = (page: number) => {
  fetchNotesList({
    Page: page,
    PageSize: 10,
  })
}

// Initial fetch
onMounted(async () => {
  console.log('Component mounted, fetching notes...')
  try {
    await store.dispatch('notes/fetchNotes', {
      Page: 1,
      PageSize: 10,
      SortBy: sortBy.value,
      SortOrder: sortOrder.value
    })
  } catch (error) {
    console.error('Initial fetch failed:', error)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  store.dispatch('notes/clearNotes')
})

// Add logout handler
const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/auth/login')
}

// Add mobile sidebar state
const isSidebarOpen = ref(false)

// Close sidebar when route changes
watch(useRoute(), () => {
  isSidebarOpen.value = false
})
</script> 