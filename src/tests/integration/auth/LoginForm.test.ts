import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import LoginForm from '@/features/auth/components/LoginForm.vue'

describe('LoginForm.vue', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: { template: '<div>Home</div>' }
      }
    ]
  })

  const store = createStore({
    state: {
      auth: {
        user: null,
        loading: false,
        error: null
      }
    },
    actions: {
      login: vi.fn()
    }
  })

  it('validates required fields', async () => {
    const wrapper = mount(LoginForm, {
      global: {
        plugins: [router, store]
      }
    })

    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Password is required')
  })

  it('validates email format', async () => {
    const wrapper = mount(LoginForm, {
      global: {
        plugins: [router, store]
      }
    })

    await wrapper.find('input[type="email"]').setValue('invalid-email')
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.text()).toContain('Invalid email address')
  })

  it('calls login action with form data', async () => {
    const wrapper = mount(LoginForm, {
      global: {
        plugins: [router, store]
      }
    })

    const testEmail = 'test@example.com'
    const testPassword = 'password123'

    await wrapper.find('input[type="email"]').setValue(testEmail)
    await wrapper.find('input[type="password"]').setValue(testPassword)
    await wrapper.find('form').trigger('submit')

    expect(store.dispatch).toHaveBeenCalledWith('login', {
      email: testEmail,
      password: testPassword
    })
  })
}) 