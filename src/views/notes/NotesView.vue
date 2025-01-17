<template>
  <!-- Main Content -->
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <div class="p-4 lg:p-6 bg-white border-b flex-shrink-0">
      <!-- Top Section -->
    

      <!-- Controls Section -->
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search Bar -->
        <div class="relative flex-grow">
          <input
            type="text"
            placeholder="Search notes..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            v-model="searchQuery"
            @input="handleSearch"
          />
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <!-- Controls Group -->
        <div class="flex items-center justify-between sm:justify-end gap-3">
          <!-- Sort Dropdown -->
          <div class="relative sort-dropdown">
            <button 
              @click.stop="showSortMenu = !showSortMenu"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowsUpDownIcon class="w-4 h-4" />
              <span class="truncate">{{ currentSort.label }}</span>
              <ChevronDownIcon class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showSortMenu }" />
            </button>
            
            <!-- Sort Menu -->
            <div v-if="showSortMenu" 
              class="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 sm:w-56 mt-2 bg-white rounded-lg shadow-lg z-50 border"
              @click.stop
            >
              <div class="p-1">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="handleSort(option)"
                  class="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md hover:bg-gray-50"
                  :class="[currentSort.value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700']"
                >
                  <span class="flex items-center gap-2">
                    <component :is="option.icon" class="w-4 h-4" />
                    {{ option.label }}
                  </span>
                  <ArrowUpIcon 
                    v-if="currentSort.value === option.value"
                    class="w-4 h-4 transition-transform"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- View Options -->
          <div class="flex items-center rounded-lg border border-gray-300 bg-white p-1 hidden sm:inline">
            <button 
              v-for="view in viewOptions" 
              :key="view.value"
              @click="currentView = view.value"
              class="p-1.5 rounded-md transition-colors"
              :class="[
                currentView === view.value 
                  ? 'bg-gray-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              ]"
            >
              <component :is="view.icon" class="w-5 h-5" />
            </button>
          </div>

          <!-- New Note Button (Desktop) -->
          <Button 
            @click="showNewNoteModal = true" 
            variant="primary" 
            class="hidden sm:flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            <span>New Note</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-hidden bg-gray-50">
      <div class="h-full overflow-y-auto px-4 lg:px-6 py-4">
        <NoteList
          :notes="sortedNotes"
          :loading="loading"
          :error="error"
          :view="currentView"
          @edit="handleEditNote"
          @delete="handleDeleteNote"
        />

        <!-- Pagination -->
        <div v-if="sortedNotes.length > 0" class="mt-6 flex justify-center pb-4">
          <Pagination 
            :current-page="pagination.currentPage"
            :total-pages="pagination.totalPages"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- Mobile New Note Button -->
    <div class="sm:hidden fixed right-4 bottom-4">
      <Button 
        @click="showNewNoteModal = true" 
        variant="primary" 
        class="rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
      >
        <PlusIcon class="w-6 h-6" />
      </Button>
    </div>
  </div>

  <!-- Modals -->
  <Modal
    v-if="showNewNoteModal"
    v-model="showNewNoteModal"
    :title="editingNote ? 'Edit Note' : 'New Note'"
    @close="handleModalClose"
  >
    <NoteForm
      :key="showNewNoteModal ? 'open' : 'closed'"
      :initial-data="editingNote || undefined"
      :loading="saving"
      @submit="handleSaveNote"
      @cancel="handleModalClose"
    />
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore, useStoreState } from '@/composables/useStore'
import type { Note, NoteFormData } from '@/features/notes/types/notes.types'
import {
  PlusIcon,
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ClockIcon,
  CalendarIcon,
  DocumentIcon,
  MagnifyingGlassIcon
} from "@heroicons/vue/24/outline";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import NoteList from "@/features/notes/components/NoteList.vue";
import NoteForm from "@/features/notes/components/NoteForm.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { debounce } from "@/utils/helpers";

const store = useStore()

// Use the enhanced store state access
const notesState = useStoreState('notes')
const notes = computed(() => notesState.value.items)
const loading = computed(() => notesState.value.loading)
const error = computed(() => notesState.value.error)
const pagination = computed(() => notesState.value.pagination)

// Local state
const saving = ref(false)
const showNewNoteModal = ref(false)
const editingNote = ref<Note | null>(null)
const currentView = ref<"grid" | "list">("grid")

const viewOptions = [
  { value: "grid" as const, icon: ViewGridIcon },
  { value: "list" as const, icon: ViewListIcon },
] as const;

// Sort options with proper typing
interface SortOption {
  label: string;
  value: 'UpdatedAt' | 'CreatedAt' | 'Title';
  icon: any;
  defaultOrder: 'asc' | 'desc';
}

const sortOptions: SortOption[] = [
  { 
    label: "Last Updated",
    value: "UpdatedAt",
    icon: ClockIcon,
    defaultOrder: 'desc'
  },
  { 
    label: "Created Date",
    value: "CreatedAt",
    icon: CalendarIcon,
    defaultOrder: 'desc'
  },
  { 
    label: "Title",
    value: "Title",
    icon: DocumentIcon,
    defaultOrder: 'asc'
  }
];

// Sort state
const showSortMenu = ref(false);
const currentSort = ref<SortOption>(sortOptions[0]);
const sortOrder = ref<'asc' | 'desc'>(sortOptions[0].defaultOrder);

// Updated sortedNotes computed
const sortedNotes = computed(() => {
  if (!notes.value) return [];
  
  return [...notes.value].sort((a, b) => {
    let aValue = a[currentSort.value.value.toLowerCase()];
    let bValue = b[currentSort.value.value.toLowerCase()];

    if (currentSort.value.value === 'UpdatedAt' || currentSort.value.value === 'CreatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    const multiplier = sortOrder.value === 'asc' ? 1 : -1;
    return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * multiplier;
  });
});

// Updated handleSort
const handleSort = (option: SortOption) => {
  if (currentSort.value.value === option.value) {
    // Toggle order if same field
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // New sort field
    currentSort.value = option;
    sortOrder.value = option.defaultOrder;
  }
  showSortMenu.value = false;
};

// Update click outside handler
onMounted(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.sort-dropdown')) {
      showSortMenu.value = false;
    }
  };

  document.addEventListener('click', handleClickOutside);
  
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
});

// Handle note operations
const handleSaveNote = async (data: NoteFormData) => {
  if (!data.title.trim() || !data.content.trim()) return;
  
  try {
    saving.value = true;
    
    if (editingNote.value) {
      await store.dispatch('notes/updateNote', {
        id: editingNote.value.noteId,
        ...data
      });
    } else {
      const result = await store.dispatch('notes/createNote', data);
      if (!result) throw new Error('Failed to create note');
    }

    // Close modal first
    showNewNoteModal.value = false;
    editingNote.value = null;
    saving.value = false;

    // Then refresh the list
    await store.dispatch('notes/fetchNotes', {
      Page: 1,
      PageSize: 10
    });
    
  } catch (err: any) {
    console.error('Failed to save note:', err);
    saving.value = false;
  }
};

const handleEditNote = (note: Note) => {
  editingNote.value = note;
  showNewNoteModal.value = true;
};

const handleDeleteNote = async (id: number) => {
  if (!confirm("Are you sure you want to delete this note?")) return;

  try {
    await store.dispatch('notes/deleteNote', id);
    // Refresh notes list
    await store.dispatch('notes/fetchNotes', {
      Page: 1,
      PageSize: 10
    });
  } catch (err: any) {
    console.error('Failed to delete note:', err);
  }
};

const handleModalClose = () => {
  if (!saving.value) {  // Only close if not saving
    showNewNoteModal.value = false;
    editingNote.value = null;
  }
};

const handlePageChange = (page: number) => {
  store.dispatch('notes/fetchNotes', {
    Page: page,
    PageSize: 10
  });
};

// Add initial fetch on component mount
onMounted(() => {
  store.dispatch('notes/fetchNotes', {
    Page: 1,
    PageSize: 10
  });

  // Watch screen size to force grid view on mobile
  const handleResize = () => {
    if (window.innerWidth < 640) { // sm breakpoint
      currentView.value = "grid"
    }
  }
  
  window.addEventListener('resize', handleResize)
  handleResize() // Initial check
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
});

// Add searchQuery ref
const searchQuery = ref('');

// Add handleSearch function
const handleSearch = debounce(() => {
  store.dispatch('notes/fetchNotes', {
    Page: 1,
    PageSize: 10,
    Query: searchQuery.value.trim()
  });
}, 300);
</script>

<style scoped>
.sort-dropdown {
  position: relative;
}


</style>
