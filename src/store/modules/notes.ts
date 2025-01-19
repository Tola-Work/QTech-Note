
import { RootState } from '@/store'
import { notesService } from '@/services/notesService'
import type { Note, NoteFormData, NoteSearchParams } from '@/features/notes/types/notes.types'
import { Commit } from 'vuex/types/index.js'

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

const state: NotesState = {
  items: [],
  selectedNote: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1
  }
}

const notes: Module<NotesState, RootState> = {
  namespaced: true,
  state,
  
  mutations: {
    SET_NOTES(state: NotesState, notes: Note[]) {
      state.items = notes
    },
    SET_LOADING(state: NotesState, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state: NotesState, error: string | null) {
      state.error = error
    },
    SET_PAGINATION(state: NotesState, pagination: { currentPage: number, totalPages: number }) {
      state.pagination = pagination
    },
    SET_SELECTED_NOTE(state: NotesState, note: Note | null) {
      state.selectedNote = note
    },
    ADD_NOTE(state: NotesState, note: Note) {
      state.items.push(note)
    },
    UPDATE_NOTE(state: NotesState, updatedNote: Note) {
      const index = state.items.findIndex(note => note.noteId === updatedNote.noteId)
      if (index !== -1) {
        state.items.splice(index, 1, updatedNote)
      }
    },
    DELETE_NOTE(state: NotesState, noteId: number) {
      state.items = state.items.filter(note => note.noteId !== noteId)
    },
    CLEAR_NOTES(state: NotesState) {
      state.items = []
      state.selectedNote = null
      state.error = null
      state.pagination = {
        currentPage: 1,
        totalPages: 1
      }
    }
  },

  actions: {
    async fetchNotes({ commit }: { commit: Commit }, params?: NoteSearchParams) {
      try {
        commit('SET_LOADING', true)
        const response = await notesService.getNotes(params)
        commit('SET_NOTES', response.data)
        commit('SET_PAGINATION', {
          currentPage: response.currentPage,
          totalPages: response.totalPages
        })
      } catch (error: any) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createNote({ commit }: { commit: Commit }, data: NoteFormData) {
      try {
        const note = await notesService.createNote(data);
        return note;
      } catch (error) {
        console.error('Failed to create note:', error);
        throw error;
      }
    },

    async updateNote({ commit }: { commit: Commit }, payload: { id: number } & NoteFormData) {
      try {
        commit('SET_LOADING', true)
        const { id, ...noteData } = payload
        const response = await notesService.updateNote(id, noteData)
        commit('UPDATE_NOTE', response)
        return response
      } catch (error: any) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteNote({ commit }: { commit: Commit }, id: number) {
      try {
        await notesService.deleteNote(id)
        commit('DELETE_NOTE', id)
      } catch (error: any) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    async fetchNoteById({ commit }: { commit: Commit }, id: number) {
      try {
        const response = await notesService.getNoteById(id)
        commit('SET_SELECTED_NOTE', response)
        return response
      } catch (error: any) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    clearNotes({ commit }: { commit: Commit }) {
      commit('CLEAR_NOTES')
    }
  },

  getters: {
    getNoteById: (state: NotesState ) => (id: number) => {
      return state.items.find(note => note.noteId === id)
    }
  }
}

export default notes 