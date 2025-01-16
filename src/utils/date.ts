import { format, formatDistance, parseISO } from 'date-fns'

export const formatDate = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, 'MMM dd, yyyy')
}

export const formatDateTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, 'MMM dd, yyyy HH:mm')
}

export const formatRelativeTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(parsedDate, new Date(), { addSuffix: true })
}

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime())
} 