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
    return response
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.items = action.payload.data
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages
        }
        state.loading = false
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch notes'
      })
      // Create note
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.items.findIndex(note => note.noteId === action.payload.noteId)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter(note => note.noteId !== action.payload)
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.selectedNote = action.payload
      })
  }
})

export default notesSlice.reducer 