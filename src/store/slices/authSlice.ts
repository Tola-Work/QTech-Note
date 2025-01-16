import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'
import type { AuthState } from '@/features/auth/types/auth.types'
import type { LoginCredentials, RegisterCredentials } from '@/features/auth/types/auth.types'
import { storage, TOKEN_KEY, USER_KEY } from '@/utils/localStorage'

const initialState: AuthState = {
  user: storage.get(USER_KEY),
  isAuthenticated: !!storage.get(TOKEN_KEY),
  loading: false,
  error: null
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    return response.data
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials) => {
    const response = await authService.register(credentials)
    return response.data
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout()
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        storage.set(USER_KEY, action.payload)
        storage.set(TOKEN_KEY, action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        storage.set(USER_KEY, action.payload)
        storage.set(TOKEN_KEY, action.payload.token)
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        storage.remove(USER_KEY)
        storage.remove(TOKEN_KEY)
      })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer 