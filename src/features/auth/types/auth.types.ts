export interface User {
  userId: number
  username: string
  email: string
  accessToken: string
  refreshToken: string
  accessTokenExpiry: string
  refreshTokenExpiry: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  username: string
  confirmPassword: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
} 