import { createStore, Store as VuexStore, CommitOptions, DispatchOptions } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'
import notes from './modules/notes'

// Define store module types
export type RootState = {
  auth: typeof auth.state
  notes: typeof notes.state
}

// Define store type with modules
export type Store = Omit<
  VuexStore<RootState>,
  'commit' | 'dispatch'
> & {
  commit<K extends keyof typeof notes.mutations, P extends Parameters<typeof notes.mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<typeof notes.mutations[K]>
} & {
  dispatch<K extends keyof typeof notes.actions>(
    key: K,
    payload?: Parameters<typeof notes.actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof notes.actions[K]>
}

// Create and export the store
export const store = createStore({
  modules: {
    auth,
    notes
  },
  plugins: [
    createPersistedState({
      key: 'qtech_note',
      paths: ['auth.user', 'auth.isAuthenticated']
    })
  ]
}) as Store 