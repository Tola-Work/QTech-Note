import { configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import notesReducer from './slices/notesSlice'
import authReducer from './slices/authSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['notes', 'auth']
}

const persistedNotesReducer = persistReducer(persistConfig, notesReducer)

export const store = configureStore({
  reducer: {
    notes: persistedNotesReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 