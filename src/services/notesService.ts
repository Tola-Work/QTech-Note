import api from './api'
import type { Note } from '@/features/notes/types/notes.types'
import type { ApiResponse } from '@/types/api'

export const notesService = {
  async getNotes(): Promise<ApiResponse<Note[]>> {
    const response = await api.get<ApiResponse<Note[]>>('/notes')
    return response.data
  },

  async getNoteById(id: string): Promise<ApiResponse<Note>> {
    const response = await api.get<ApiResponse<Note>>(`/notes/${id}`)
    return response.data
  },

  async createNote(note: Partial<Note>): Promise<ApiResponse<Note>> {
    const response = await api.post<ApiResponse<Note>>('/notes', note)
    return response.data
  },

  async updateNote(id: string, note: Partial<Note>): Promise<ApiResponse<Note>> {
    const response = await api.put<ApiResponse<Note>>(`/notes/${id}`, note)
    return response.data
  },

  async deleteNote(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/notes/${id}`)
    return response.data
  },

  async searchNotes(query: string): Promise<ApiResponse<Note[]>> {
    const response = await api.get<ApiResponse<Note[]>>('/notes/search', {
      params: { q: query }
    })
    return response.data
  }
} 