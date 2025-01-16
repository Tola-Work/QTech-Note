<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <Sidebar 
      @new-note="showNewNoteModal = true" 
      @search="handleSearch"
      :activeSort="sortBy"
      @sort="handleSort"
    />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- App Bar -->
      <AppBar @logout="handleLogout" />

      <!-- Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Page Header -->
        <div class="p-6 bg-white border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">My Notes</h2>
            
            <div class="flex items-center gap-4">
              <!-- View Options -->
              <div class="flex items-center gap-2">
                <button 
                  v-for="view in viewOptions" 
                  :key="view.value"
                  @click="currentView = view.value"
                  :class="[
                    'p-2 rounded',
                    currentView === view.value ? 'text-blue-600' : 'text-gray-400'
                  ]"
                >
                  <component :is="view.icon" class="w-5 h-5" />
                </button>
              </div>

              <Button @click="showNewNoteModal = true" variant="primary">
                <PlusIcon class="w-5 h-5 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>

        <!-- Scrollable Notes Area -->
        <div class="flex-1 overflow-y-auto p-6">
          <NoteList
            :notes="notes"
            :loading="loading"
            :error="error"
            :view="currentView"
            @edit="handleEditNote"
            @delete="handleDeleteNote"
          />

          <!-- Pagination -->
          <div v-if="notes.length > 0" class="mt-6 flex justify-center">
            <Pagination 
              :current-page="currentPage"
              :total-pages="totalPages"
              @change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <Modal
      v-if="showNewNoteModal"
      v-model="showNewNoteModal"
      :title="editingNote ? 'Edit Note' : 'New Note'"
    >
      <NoteForm
        :initial-data="editingNote || undefined"
        :loading="saving"
        @submit="handleSaveNote"
        @cancel="handleCancelEdit"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/store/slices/notesSlice";
import {
  PlusIcon,
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon
} from "@heroicons/vue/24/outline";
import type { Note, NoteFormData, NoteSearchParams } from "@/features/notes/types/notes.types";
import AppBar from "@/components/layout/AppBar.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import NoteList from "@/features/notes/components/NoteList.vue";
import NoteForm from "@/features/notes/components/NoteForm.vue";
import Pagination from "@/components/ui/Pagination.vue";

const router = useRouter();
const dispatch = useAppDispatch();

// State
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const showNewNoteModal = ref(false);
const editingNote = ref<Note | null>(null);
const sortBy = ref("lastUpdated");
const currentView = ref<"grid" | "list">("grid");

const viewOptions = [
  { value: "grid", icon: ViewGridIcon },
  { value: "list", icon: ViewListIcon },
];

// Store selectors
const notes = useAppSelector((state) => state.notes.items);
const currentPage = useAppSelector((state) => state.notes.pagination.currentPage);
const totalPages = useAppSelector((state) => state.notes.pagination.totalPages);

// Handlers
const handleLogout = async () => {
  await dispatch(logout());
  router.push("/auth/login");
};

const handleSort = (sort: string) => {
  sortBy.value = sort;
  handleSearch({ Page: 1, PageSize: 10 });
};

// Fetch notes on component mount
onMounted(async () => {
  try {
    loading.value = true;
    await dispatch(
      fetchNotes({
        Page: 1,
        PageSize: 10
      })
    );
  } catch (err: any) {
    error.value = err.message || "Failed to fetch notes";
  } finally {
    loading.value = false;
  }
});

// Handle note operations
const handleSaveNote = async (data: NoteFormData) => {
  try {
    saving.value = true;
    if (editingNote.value) {
      await dispatch(
        updateNote({ id: editingNote.value.noteId, ...data })
      ).unwrap();
    } else {
      await dispatch(createNote(data)).unwrap();
    }
    showNewNoteModal.value = false;
    editingNote.value = null;
    // Refresh notes list
    await dispatch(fetchNotes());
  } catch (err: any) {
    error.value = err.message || "Failed to save note";
  } finally {
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
    await dispatch(deleteNote(id)).unwrap();
    // Refresh notes list
    await dispatch(fetchNotes());
  } catch (err: any) {
    error.value = err.message || "Failed to delete note";
  }
};

const handleCancelEdit = () => {
  editingNote.value = null;
  showNewNoteModal.value = false;
};

const handleSearch = async (params: NoteSearchParams) => {
  try {
    loading.value = true;
    await dispatch(
      fetchNotes({
        Page: 1,
        PageSize: 10,
      })
    );
  } catch (err: any) {
    error.value = err.message || "Failed to search notes";
  } finally {
    loading.value = false;
  }
};

// Add page change handler
const handlePageChange = async (page: number) => {
  try {
    loading.value = true;
    await dispatch(
      fetchNotes({
        Page: page,
        PageSize: 10,
      })
    );
  } catch (err: any) {
    error.value = err.message || "Failed to fetch notes";
  } finally {
    loading.value = false;
  }
};
</script>
