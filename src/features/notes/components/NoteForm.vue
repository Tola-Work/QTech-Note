<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          v-model="form.title"
          :class="[
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            errors.title ? 'border-red-500' : ''
          ]"
          :disabled="loading"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          v-model="form.content"
          rows="4"
          :class="[
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            errors.content ? 'border-red-500' : ''
          ]"
          :disabled="loading"
        ></textarea>
        <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <Button 
        type="button" 
        variant="secondary" 
        @click="handleCancel"
        :disabled="loading"
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="!form.title.trim() || !form.content.trim()"
      >
        {{ initialData ? 'Update' : 'Create' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { NoteFormData } from '../types/notes.types';
import Button from '@/components/ui/Button.vue';
import { noteSchema, validateForm } from '@/utils/validation'
const props = defineProps<{
  initialData?: {
    title: string;
    content: string;
  };
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: NoteFormData): void;
  (e: 'cancel'): void;
}>();

const form = ref({
  title: '',
  content: ''
});

const errors = ref<Record<string, string>>({})

// Watch for initialData changes
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = {
      title: newData.title,
      content: newData.content
    };
  } else {
    form.value = {
      title: '',
      content: ''
    };
  }
}, { immediate: true });

const handleSubmit = async () => {

  const { isValid, errors: validationErrors } = await validateForm(noteSchema, form.value)
  if (!isValid) {
    errors.value = validationErrors
    return
  }

  if (!form.value.title.trim() || !form.value.content.trim()) return;
  
  emit('submit', {
    title: form.value.title.trim(),
    content: form.value.content.trim()
  });
};

const handleCancel = () => {
  emit('cancel');
};
</script> 