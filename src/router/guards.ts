

import type { NavigationGuard, Router } from 'vue-router'
import { store } from '@/store'
import { ROUTES, PUBLIC_ROUTES } from '@/constants/routes'

export const authGuard: NavigationGuard = (to, _, next) => {
  const isAuthenticated = store.getState().auth.isAuthenticated
  const isPublicRoute = PUBLIC_ROUTES.includes(to.path)

  if (!isAuthenticated && !isPublicRoute) {
    // Redirect to login if trying to access protected route without auth
    next({
      path: ROUTES.AUTH.LOGIN,
      query: { redirect: to.fullPath }
    })
  } else if (isAuthenticated && isPublicRoute) {
    // Redirect to home if trying to access auth routes while logged in
    next({ path: ROUTES.HOME })
  } else {
    next()
  }
}

export const setupGuards = (router: Router) => {
  router.beforeEach(authGuard)
} 