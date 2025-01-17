const PREFIX = 'qtech_note_'

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
    }
  },

  clear: (): void => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

export const REFRESH_TOKEN_KEY = 'refresh_token'
export const TOKEN_KEY = 'access_token'
export const USER_KEY = 'user'
export const THEME_KEY = 'theme' 
