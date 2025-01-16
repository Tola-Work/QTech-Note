<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
      />
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </div>

    <div v-if="error" class="text-red-600 text-sm">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/store/slices/authSlice'
import type { LoginCredentials } from '../types/auth.types'

const app = getCurrentInstance()
const store = app?.appContext.app.config.globalProperties.$store

const router = useRouter()
const route = useRoute()

const form = ref<LoginCredentials>({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    await store.dispatch(login(form.value))
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (err: any) {
    error.value = err.message || 'Failed to login'
  } finally {
    loading.value = false
  }
}
</script> 