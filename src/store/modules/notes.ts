import { Module } from 'vuex'
import { RootState } from '@/store'
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
    SET_NOTES(state, notes: Note[]) {
      state.items = notes
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination
    },
    SET_SELECTED_NOTE(state, note: Note | null) {
      state.selectedNote = note
    },
    ADD_NOTE(state, note: Note) {
      state.items.push(note)
    },
    UPDATE_NOTE(state, updatedNote: Note) {
      const index = state.items.findIndex(note => note.noteId === updatedNote.noteId)
      if (index !== -1) {
        state.items.splice(index, 1, updatedNote)
      }
    },
    DELETE_NOTE(state, noteId: number) {
      state.items = state.items.filter(note => note.noteId !== noteId)
    },
    CLEAR_NOTES(state) {
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
    async fetchNotes({ commit }, params?: NoteSearchParams) {
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

    async createNote({ commit }, data: NoteFormData) {
      try {
        const note = await notesService.createNote(data);
        return note;
      } catch (error) {
        console.error('Failed to create note:', error);
        throw error;
      }
    },

    async updateNote({ commit }, payload: { id: number } & NoteFormData) {
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

    async deleteNote({ commit }, id: number) {
      try {
        await notesService.deleteNote(id)
        commit('DELETE_NOTE', id)
      } catch (error: any) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    async fetchNoteById({ commit }, id: number) {
      try {
        const response = await notesService.getNoteById(id)
        commit('SET_SELECTED_NOTE', response)
        return response
      } catch (error: any) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    clearNotes({ commit }) {
      commit('CLEAR_NOTES')
    }
  },

  getters: {
    getNoteById: (state) => (id: number) => {
      return state.items.find(note => note.noteId === id)
    }
  }
}

export default notes 