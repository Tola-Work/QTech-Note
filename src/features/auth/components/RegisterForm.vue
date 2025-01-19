<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
      <input
        id="username"
        v-model="form.username"
        type="text"
        :class="[
          'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
          errors.username ? 'border-red-500' : ''
        ]"
      />
      <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="text"
        :class="[
          'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
          errors.email ? 'border-red-500' : ''
        ]"
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        
        :class="[
          'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
          errors.password ? 'border-red-500' : ''
        ]"
      />
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
      <input
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        :class="[
          'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
          errors.confirmPassword ? 'border-red-500' : ''
        ]"
      />
      <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </div>

    <div v-if="error" class="text-red-600 text-sm">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/composables/useStore'
import { registerSchema, validateForm } from '@/utils/validation'
import type { RegisterCredentials } from '../types/auth.types'
import { ROUTES } from '@/constants/routes'

const router = useRouter()
const store = useStore()

const form = ref<RegisterCredentials>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const errors = ref<Record<string, string>>({})

const handleSubmit = async () => {
  const { isValid, errors: validationErrors } = await validateForm(registerSchema, form.value)
  
  if (!isValid) {
    errors.value = validationErrors
    return
  }

  try {
    loading.value = true
    error.value = ''
    await store.dispatch('auth/register', form.value)
    router.push(ROUTES.HOME)
  } catch (err: any) {
    error.value = err.message || 'Failed to register'
  } finally {
    loading.value = false
  }
}
</script> 