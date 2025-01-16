import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'
import type { AuthState } from '@/features/auth/types/auth.types'
import type { LoginCredentials, RegisterCredentials } from '@/features/auth/types/auth.types'
import { storage, TOKEN_KEY, USER_KEY, REFRESH_TOKEN_KEY } from '@/utils/localStorage'

const initialState: AuthState = {
  user: storage.get(USER_KEY),
  isAuthenticated: !!storage.get(TOKEN_KEY),
  loading: false,
  error: null
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
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
        storage.set(TOKEN_KEY, action.payload.accessToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Login failed'
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        storage.set(USER_KEY, action.payload)
        storage.set(TOKEN_KEY, action.payload.accessToken)
        storage.set(REFRESH_TOKEN_KEY, action.payload.refreshToken)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Registration failed'
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