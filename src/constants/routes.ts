export const ROUTES = {
  HOME: '/',
  
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },

  // Notes routes
  NOTES: {
    LIST: '/',
    DETAIL: (id: string) => `/notes/${id}`,
    CREATE: '/notes/create',
    EDIT: (id: string) => `/notes/${id}/edit`
  }
}

export const ROUTE_NAMES = {
  HOME: 'home',
  
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register'
  },

  NOTES: {
    LIST: 'notes',
    DETAIL: 'note-detail',
    CREATE: 'note-create',
    EDIT: 'note-edit'
  }
}

export const PUBLIC_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER
]

export const AUTH_LAYOUT_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER
] 