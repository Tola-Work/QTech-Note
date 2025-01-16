<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-primary-600">
              {{ appName }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <div class="hidden md:ml-4 md:flex md:items-center">
            <Button
              v-if="isAuthenticated"
              variant="ghost"
              @click="handleLogout"
            >
              Logout
            </Button>
            <template v-else>
              <router-link to="/auth/login">
                <Button variant="ghost">Login</Button>
              </router-link>
              <router-link to="/auth/register" class="ml-4">
                <Button>Register</Button>
              </router-link>
            </template>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center md:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              @click="isMenuOpen = !isMenuOpen"
            >
              <span class="sr-only">Open main menu</span>
              <i :class="isMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <template v-if="isAuthenticated">
          <button
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link
            to="/auth/login"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Login
          </router-link>
          <router-link
            to="/auth/register"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Register
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const dispatch = useAppDispatch()
const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
const isMenuOpen = ref(false)
const appName = import.meta.env.VITE_APP_NAME

const handleLogout = async () => {
  await dispatch(logout())
  router.push('/auth/login')
  isMenuOpen.value = false
}
</script> 