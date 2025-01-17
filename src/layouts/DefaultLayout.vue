<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b flex-shrink-0">
      <div class="flex items-center justify-between px-4 lg:px-6 h-14">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <img src="@/assets/images/logo.svg" alt="Logo" class="h-8 w-8" />
          <span class="ml-2 text-lg font-semibold ">QTech Notes</span>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button 
            @click.stop="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100"
          >
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-sm font-medium text-blue-600">
                {{ userInitial }}
              </span>
            </div>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border py-1"
            @click.stop
          >
            <div class="px-4 py-2 border-b">
              <p class="text-sm font-medium text-gray-700">{{ displayName }}</p>
              <p class="text-xs text-gray-500">{{ userInfo.email }}</p>
            </div>
            <button 
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              <ArrowLeftOnRectangleIcon class="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden bg-gray-50">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from '@/composables/useStore'
import { useRouter } from 'vue-router'
import {
  ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/outline"

interface UserInfo {
  email: string;
  username: string;
  userId: number;
}

const store = useStore()
const router = useRouter()
const showUserMenu = ref(false)

// Add computed property for user info
const userInfo = computed((): UserInfo => {
  const userStr = localStorage.getItem('qtech_note_user')
  if (userStr) {
    const userData = JSON.parse(userStr)
    return {
      email: userData.email || '',
      username: userData.username || userData.email.split('@')[0], // Fallback to email username
      userId: userData.userId
    }
  }
  return { email: '', username: '', userId: 0 }
})

// Compute display name and initial
const displayName = computed(() => {
  return userInfo.value.username || userInfo.value.email.split('@')[0]
})

const userInitial = computed(() => {
  return displayName.value.charAt(0).toUpperCase()
})

// Handle click outside to close user menu
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.user-menu')) {
    showUserMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/auth/login')
}
</script> 