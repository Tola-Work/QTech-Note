import type { NavigationGuard,Router } from 'vue-router'
import { store } from '@/store'
import { ROUTES, PUBLIC_ROUTES } from '@/constants/routes'

export const authGuard: NavigationGuard = (to, _, next) => {
  const authState = typeof store.state.auth === 'function' ? store.state.auth() : store.state.auth
  const isAuthenticated = authState?.isAuthenticated ?? false
  const isPublicRoute = PUBLIC_ROUTES.includes(to.path)

  if (!isAuthenticated && !isPublicRoute) {
    next({
      path: ROUTES.AUTH.LOGIN,
      query: { redirect: to.fullPath }
    })
  } else if (isAuthenticated && isPublicRoute) {
    next({ path: ROUTES.HOME })
  } else {
    next()
  }
}

export const setupGuards = (router: Router) => {
  router.beforeEach(authGuard)
} 