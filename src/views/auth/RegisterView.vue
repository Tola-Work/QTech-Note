<template>
  <div>
    <RegisterForm />
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <router-link
          to="/auth/login"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/features/auth/components/RegisterForm.vue'
</script> 