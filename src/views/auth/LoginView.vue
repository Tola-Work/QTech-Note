<template>
  <div>
    <LoginForm />
    <div class="mt-6 text-center text-sm">
      <router-link
        to="/auth/register"
        class="font-medium text-primary-600 hover:text-primary-500"
      >
        Don't have an account? Sign up
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/features/auth/components/LoginForm.vue'
</script> 