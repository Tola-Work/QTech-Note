import { computed } from 'vue'
import { useStore as baseUseStore } from 'vuex'
import type { Store } from '@/store'

export function useStore(): Store {
  return baseUseStore()
}

// Add type helpers
export function useStoreState<K extends keyof Store['state']>(key: K) {
  const store = useStore()
  return computed(() => store.state[key])
}

export function useStoreGetter<T>(key: string) {
  const store = useStore()
  return computed(() => store.getters[key])
} 