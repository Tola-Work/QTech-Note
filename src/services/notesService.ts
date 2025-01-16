import api from './api'
import type { Note, PaginatedResponse, NoteSearchParams } from '@/features/notes/types/notes.types'
import type { ApiResponse } from '@/types/api'

export const notesService = {
  async getNotes(params?: NoteSearchParams): Promise<PaginatedResponse<Note>> {
    const apiParams = {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 10,
      SortBy: params?.SortBy || 'UpdatedAt',
      SortOrder: (params?.SortOrder || 'desc').toUpperCase(),
      title: params?.Query || ''
    };

    console.log('API request params:', apiParams);

    const endpoint = apiParams.title ? '/Note/SearchNotes' : '/Note/GetAll';
    const response = await api.get(endpoint, {
      params: apiParams
    });

    console.log('API response:', response);
    
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

  async updateNote(id: number, note: Partial<Note>): Promise<Note> {
    const response = await api.put<Note>(`/Note/Update/${id}`, note)
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