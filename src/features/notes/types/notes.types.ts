export interface Note {
  id: string
  title: string
  content?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface NoteFormData {
  title: string
  content: string
}

export interface NoteSearchParams {
  query?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
} 