import { format, formatDistanceToNow, isBefore, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatDate = (iso) =>
  format(parseISO(iso), 'd MMM yyyy', { locale: fr })

export const formatDateInput = (iso) =>
  format(parseISO(iso), 'yyyy-MM-dd')

export const fromNow = (iso) =>
  formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: fr })

export const isOverdue = (dueDateISO) =>
  dueDateISO ? isBefore(parseISO(dueDateISO), new Date()) : false

export const nowISO = () => new Date().toISOString()
