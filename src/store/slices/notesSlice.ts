import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notesService } from '@/services/notesService'
import type { Note } from '@/features/notes/types/notes.types'

interface NotesState {
  items: Note[]
  selectedNote: Note | null
  loading: boolean
  error: string | null
}

const initialState: NotesState = {
  items: [],
  selectedNote: null,
  loading: false,
  error: null
}

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async () => {
    const response = await notesService.getNotes()
    return response.data
  }
)

export const fetchNoteById = createAsyncThunk(
  'notes/fetchNoteById',
  async (id: string) => {
    const response = await notesService.getNoteById(id)
    return response.data
  }
)

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (note: Partial<Note>) => {
    const response = await notesService.createNote(note)
    return response.data
  }
)

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, ...note }: Partial<Note> & { id: string }) => {
    const response = await notesService.updateNote(id, note)
    return response.data
  }
)

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: string) => {
    await notesService.deleteNote(id)
    return id
  }
)

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch notes'
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.selectedNote = action.payload
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.items.findIndex(note => note.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.selectedNote?.id === action.payload.id) {
          state.selectedNote = action.payload
        }
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter(note => note.id !== action.payload)
        if (state.selectedNote?.id === action.payload) {
          state.selectedNote = null
        }
      })
  }
})

export const { clearError } = notesSlice.actions
export default notesSlice.reducer 