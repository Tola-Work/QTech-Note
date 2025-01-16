import api from './api'
import type { LoginCredentials, RegisterCredentials, User } from '@/features/auth/types/auth.types'
import type { ApiResponse } from '@/types/api'

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>('/auth/login', credentials)
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token)
    }
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>('/auth/register', credentials)
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token)
    }
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data
  }
} 