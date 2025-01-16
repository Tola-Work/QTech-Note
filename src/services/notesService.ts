import api from './api'
import type { Note, PaginatedResponse, NoteSearchParams } from '@/features/notes/types/notes.types'
import type { ApiResponse } from '@/types/api'

export const notesService = {
  async getNotes(params?: NoteSearchParams): Promise<PaginatedResponse<Note>> {
    console.log('Fetching notes with params:', params);
    const response = await api.get('/Note/GetAll', {
      params: {
        Page: params?.Page || 1,
        PageSize: params?.PageSize || 10
      }
    });

    console.log('Raw API response:', response);
    
    // Extract the nested data structure
    const { data: responseData } = response;
    
    return {
      data: responseData.data || [],
      currentPage: responseData.currentPage,
      totalPages: responseData.totalPages
    };
  },

  async getNoteById(id: number): Promise<Note> {
    const response = await api.get<Note>(`/Note/GetById/${id}`)
    return response.data
  },

  async createNote(note: Partial<Note>): Promise<ApiResponse<Note>> {
    const response = await api.post<ApiResponse<Note>>('/Note/Create', note)
    return response.data
  },

  async updateNote(id: number, note: Partial<Note>): Promise<ApiResponse<Note>> {
    const response = await api.put<ApiResponse<Note>>(`/Note/Update/${id}`, note)
    return response.data
  },

  async deleteNote(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/Note/Delete/${id}`)
    return response.data
  },

  async searchNotes(query: string): Promise<ApiResponse<Note[]>> {
    const response = await api.get<ApiResponse<Note[]>>('/notes/search', {
      params: { q: query }
    })
    return response.data
  }
} 