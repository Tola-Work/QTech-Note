<template>
    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- App Bar -->

      <!-- Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Page Header -->
        <div class="p-6 bg-white border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">QTech Notes</h2>
            
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
              :current-page="pagination.currentPage"
              :total-pages="pagination.totalPages"
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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createNote,
  updateNote,
  deleteNote,
  fetchNotes,
} from "@/store/slices/notesSlice";
import {
  PlusIcon,
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon
} from "@heroicons/vue/24/outline";
import type { Note, NoteFormData } from "@/features/notes/types/notes.types";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import NoteList from "@/features/notes/components/NoteList.vue";
import NoteForm from "@/features/notes/components/NoteForm.vue";
import Pagination from "@/components/ui/Pagination.vue";

useRouter();
const dispatch = useAppDispatch();

// Redux selectors
const notes = useAppSelector((state) => state.notes.items);
const loading = useAppSelector((state) => state.notes.loading);
const error = useAppSelector((state) => state.notes.error);
const pagination = useAppSelector((state) => state.notes.pagination);

// Local state
const saving = ref(false);
const showNewNoteModal = ref(false);
const editingNote = ref<Note | null>(null);
const currentView = ref<"grid" | "list">("grid");

const viewOptions = [
  { value: "grid" as const, icon: ViewGridIcon },
  { value: "list" as const, icon: ViewListIcon },
] as const;

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
    await dispatch(fetchNotes({
      Page: 1,
      PageSize: 10
    }));
  } catch (err: any) {
    console.error('Failed to save note:', err);
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
    await dispatch(fetchNotes({
      Page: 1,
      PageSize: 10
    }));
  } catch (err: any) {
    console.error('Failed to delete note:', err);
  }
};

const handleCancelEdit = () => {
  editingNote.value = null;
  showNewNoteModal.value = false;
};

const handlePageChange = (page: number) => {
  dispatch(fetchNotes({
    Page: page,
    PageSize: 10
  }));
};

// Add initial fetch on component mount
onMounted(() => {
  dispatch(fetchNotes({
    Page: 1,
    PageSize: 10
  }));
});
</script>
