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
  query?: string;
  sortBy: 'updatedAt' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface NoteFormData {
  title: string
  content: string
}

export type SortState = {
  by: string;
  order: 'asc' | 'desc';
}; 