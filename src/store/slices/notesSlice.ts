import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notesService } from '@/services/notesService'
import type { Note, NoteFormData, NoteSearchParams } from '@/features/notes/types/notes.types'

interface NotesState {
  items: Note[]
  selectedNote: Note | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
  }
}

const initialState: NotesState = {
  items: [],
  selectedNote: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1
  }
}

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (params?: NoteSearchParams) => {
    const defaultParams = {
      Page: 1,
      PageSize: 10,
      ...params
    }
    const response = await notesService.getNotes(defaultParams)
    // Return the exact structure we want to store
    return {
      items: response.data,
      pagination: {
        currentPage: response.currentPage,
        totalPages: response.totalPages
      }
    }
  }
)

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (note: NoteFormData) => {
    const response = await notesService.createNote(note)
    return response.data
  }
)

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, ...note }: NoteFormData & { id: number }) => {
    const response = await notesService.updateNote(id, note)
    return response.data
  }
)

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: number) => {
    await notesService.deleteNote(id)
    return id
  }
)

export const fetchNoteById = createAsyncThunk(
  'notes/fetchNoteById',
  async (id: number) => {
    const response = await notesService.getNoteById(id)
    return response
  }
)

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // Add a reducer to clear the state when needed
    clearNotes: (state) => {
      state.items = []
      state.selectedNote = null
      state.error = null
      state.pagination = {
        currentPage: 1,
        totalPages: 1
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        // Directly update the state with the transformed data
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.loading = false
        state.error = null
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch notes'
        state.items = [] // Clear items on error
      })
      // Create note
      .addCase(createNote.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload]
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        state.items = state.items.map(note => 
          note.noteId === action.payload.noteId ? action.payload : note
        )
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter(note => note.noteId !== action.payload)
      })
      // Fetch note by id
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.selectedNote = action.payload
      })
  }
})

export const { clearNotes } = notesSlice.actions
export default notesSlice.reducer 