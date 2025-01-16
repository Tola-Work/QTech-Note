<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <img class="mx-auto h-12 w-auto" src="@/assets/images/logo.svg" alt="Logo" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ title }}
        </h2>
      </div>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTES } from '@/constants/routes'

const route = useRoute()

const title = computed(() => {
  switch (route.path) {
    case ROUTES.AUTH.LOGIN:
      return 'Sign in to your account'
    case ROUTES.AUTH.REGISTER:
      return 'Create your account'
    default:
      return 'Authentication'
  }
})
</script> 