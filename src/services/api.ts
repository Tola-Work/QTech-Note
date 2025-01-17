import axios from 'axios'
import { storage, TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/localStorage'

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL) // For debugging

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = storage.get(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove(TOKEN_KEY)
      storage.remove(REFRESH_TOKEN_KEY)
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api 