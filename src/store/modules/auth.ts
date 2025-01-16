import { Module } from 'vuex'
import { RootState } from '@/store'
import { authService } from '@/services/authService'
import type { AuthState, LoginCredentials, RegisterCredentials } from '@/features/auth/types/auth.types'
import { storage, TOKEN_KEY, USER_KEY, REFRESH_TOKEN_KEY } from '@/utils/localStorage'

const state: AuthState = {
  user: storage.get(USER_KEY),
  isAuthenticated: !!storage.get(TOKEN_KEY),
  loading: false,
  error: null
}

const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,

  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    }
  },

  actions: {
    async login({ commit }, credentials: LoginCredentials) {
      try {
        commit('SET_LOADING', true)
        const response = await authService.login(credentials)
        
        storage.set(TOKEN_KEY, response.data.accessToken)
        storage.set(REFRESH_TOKEN_KEY, response.data.refreshToken)
        storage.set(USER_KEY, response.data)
        
        commit('SET_USER', response.data)
        return response.data
      } catch (error: any) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async register({ commit }, credentials: RegisterCredentials) {
      try {
        commit('SET_LOADING', true)
        const response = await authService.register(credentials)
        
        storage.set(TOKEN_KEY, response.data.accessToken)
        storage.set(REFRESH_TOKEN_KEY, response.data.refreshToken)
        storage.set(USER_KEY, response.data)
        
        commit('SET_USER', response.data)
        return response.data
      } catch (error: any) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async logout({ commit }) {
      try {
        await authService.logout()
      } finally {
        storage.remove(TOKEN_KEY)
        storage.remove(REFRESH_TOKEN_KEY)
        storage.remove(USER_KEY)
        commit('CLEAR_AUTH')
      }
    }
  }
}

export default auth 