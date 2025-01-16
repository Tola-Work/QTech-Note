export interface Note {
  id: string
  title: string
  content?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface User {
  id: string
  email: string
  username: string
  token?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  username: string
  confirmPassword: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
} 