import api from './api'
import type { LoginCredentials, RegisterCredentials, User } from '@/features/auth/types/auth.types'
import type { ApiResponse } from '@/types/api'
import { storage, TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/localStorage'

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<User>('/Auth/Login', credentials)
      
      // Store tokens
      if (response.data.accessToken) {
        storage.set(TOKEN_KEY, response.data.accessToken)
        storage.set(REFRESH_TOKEN_KEY, response.data.refreshToken)
      }

      return {
        data: response.data,
        success: true
      }
    } catch (error: any) {
      // Handle error response from server
      const errorMessage = error.response?.data || 'Invalid email or password'
      throw new Error(errorMessage)
    }
  },

  async register(credentials: RegisterCredentials): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<User>('/User/Register', credentials)
      
      // Store tokens
      if (response.data.accessToken) {
        storage.set(TOKEN_KEY, response.data.accessToken)
        storage.set(REFRESH_TOKEN_KEY, response.data.refreshToken)
      }

      return {
        data: response.data,
        success: true
      }
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Registration failed'
      throw new Error(errorMessage)
    }
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
    storage.remove(TOKEN_KEY)
    storage.remove(REFRESH_TOKEN_KEY)
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<User>('/auth/me')
    return {
      data: response.data,
      success: true
    }
  }
} 