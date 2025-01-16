import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/ui/Button.vue'

describe('Button.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies correct classes for different variants', () => {
    const variants = ['primary', 'secondary', 'danger', 'ghost']
    variants.forEach(variant => {
      const wrapper = mount(Button, {
        props: { variant }
      })
      expect(wrapper.classes()).toContain(`bg-${variant}-600`)
    })
  })

  it('shows loading spinner when loading prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })
    expect(wrapper.find('.btn-spinner').exists()).toBe(true)
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
}) 