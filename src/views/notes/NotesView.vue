<template>
    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- App Bar -->

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
            :debug="true"
            @edit="handleEditNote"
            @delete="handleDeleteNote"
          />

          <!-- Component Debug Info -->
          <div v-if="true" class="mt-4 p-4 bg-gray-100 rounded">
            <pre class="text-xs">
NotesView Props:
notes: {{ notes?.length || 0 }} items
loading: {{ loading }}
error: {{ error || 'none' }}
currentPage: {{ currentPage }}
totalPages: {{ totalPages }}
            </pre>
          </div>

          <!-- Pagination -->
          <div v-if="notes.length > 0" class="mt-6 flex justify-center">
            <Pagination 
              :current-page="currentPage"
              :total-pages="totalPages"
              @change="$emit('page-change', $event)"
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
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
import type { Note, NoteFormData, NoteSearchParams } from "@/features/notes/types/notes.types";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import NoteList from "@/features/notes/components/NoteList.vue";
import NoteForm from "@/features/notes/components/NoteForm.vue";
import Pagination from "@/components/ui/Pagination.vue";

const router = useRouter();
const dispatch = useAppDispatch();

const props = defineProps<{
  notes: Note[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
}>()

// Watch props changes
watch(() => props.notes, (newNotes) => {
  console.log('Notes prop changed:', newNotes);
}, { immediate: true });

defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'search', params: NoteSearchParams): void
  (e: 'sort', sort: string): void
}>()

// Local state
const saving = ref(false);
const showNewNoteModal = ref(false);
const editingNote = ref<Note | null>(null);
const currentView = ref<"grid" | "list">("grid");

const viewOptions = [
  { value: "grid", icon: ViewGridIcon },
  { value: "list", icon: ViewListIcon },
];

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
</script>
