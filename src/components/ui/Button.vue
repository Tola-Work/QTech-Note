<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses,
      variantClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2">
      <span class="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
    </span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false
})

const sizeClasses = computed(() => ({
  'px-3 py-1.5 text-sm': props.size === 'sm',
  'px-4 py-2 text-base': props.size === 'md',
  'px-6 py-3 text-lg': props.size === 'lg'
}))

const variantClasses = computed(() => ({
  'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500': props.variant === 'primary',
  'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-primary-500': props.variant === 'secondary',
  'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500': props.variant === 'danger',
  'text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500': props.variant === 'ghost'
}))
</script> 