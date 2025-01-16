import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes'
import { setupGuards } from './guards'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import NotesView from '@/views/notes/NotesView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: ROUTE_NAMES.AUTH.LOGIN,
          component: () => import('@/views/auth/LoginView.vue')
        },
        {
          path: 'register',
          name: ROUTE_NAMES.AUTH.REGISTER,
          component: () => import('@/views/auth/RegisterView.vue')
        }
      ]
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'notes',
          component: NotesView,
          props: true
        },
        {
          path: 'notes/:id',
          name: ROUTE_NAMES.NOTES.DETAIL,
          component: () => import('@/views/notes/NoteDetailView.vue')
        }
      ]
    }
  ]
})

setupGuards(router)

export default router 