export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
}

export interface Note {
  noteId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  userId: number;
}

export interface NoteSearchParams {
  Page?: number
  PageSize?: number
}

export interface NoteFormData {
  title: string
  content: string
} 