import { store } from './index'
import type { RootState } from './index'

// Custom hook for using Redux state in Vue components
export const useAppSelector = <T>(selector: (state: RootState) => T): T => {
  return selector(store.getState())
}

// Custom hook for dispatching actions
export const useAppDispatch = () => {
  return store.dispatch
}

// Subscribe to store changes
export const useStoreSubscription = (callback: () => void) => {
  store.subscribe(callback)
} 