import type { NavigationGuard } from 'vue-router'
import { store } from '@/store'
import { ROUTES, PUBLIC_ROUTES } from '@/constants/routes'

export const authGuard: NavigationGuard = (to, _, next) => {
  const isAuthenticated = store.state.auth.isAuthenticated
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