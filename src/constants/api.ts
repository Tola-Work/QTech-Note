const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const API_ROUTES = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    ME: `${API_BASE_URL}/auth/me`
  },

  // Notes endpoints
  NOTES: {
    BASE: `${API_BASE_URL}/notes`,
    DETAIL: (id: string) => `${API_BASE_URL}/notes/${id}`,
    SEARCH: `${API_BASE_URL}/notes/search`
  }
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

export const API_ERROR_MESSAGES = {
  DEFAULT: 'Something went wrong. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.'
} 