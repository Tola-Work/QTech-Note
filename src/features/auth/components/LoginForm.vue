<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
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
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        :class="[
          'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
          errors.password ? 'border-red-500' : ''
        ]"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <div v-if="error" class="text-red-600 text-sm mt-2">
      {{ error }}
    </div>

    <Button
      type="submit"
      :loading="loading"
      :disabled="loading"
      class="w-full mt-4"
    >
      Sign in
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/composables/useStore'
import { useRouter, useRoute } from 'vue-router'
import type { LoginCredentials } from '../types/auth.types'
import { loginSchema, validateForm } from '@/utils/validation'
import Button from '@/components/ui/Button.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const form = ref<LoginCredentials>({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const errors = ref<Record<string, string>>({})
const handleSubmit = async () => {
  const { isValid, errors: validationErrors } = await validateForm(loginSchema, form.value)
  if (!isValid) {
    errors.value = validationErrors
    return
  }
  try {
    loading.value = true
    error.value = ''
    await store.dispatch('auth/login', form.value)
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (err: any) {
    error.value = err.message || 'Failed to login'
  } finally {
    loading.value = false
  }
}
</script> 