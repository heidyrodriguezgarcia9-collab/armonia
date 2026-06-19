import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameMonth, isSameDay, isToday, addMonths, subMonths,
  parseISO, startOfWeek, endOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: es })
}

export function formatDayName(date: Date): string {
  return format(date, 'EEEE', { locale: es })
}

export function formatDayNumber(date: Date): string {
  return format(date, 'd')
}

export function formatDateShort(date: Date): string {
  return format(date, 'd MMM', { locale: es })
}

export function formatDateLong(date: Date): string {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
}

export function getCalendarDays(date: Date): Date[] {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  return eachDayOfInterval({ start: calStart, end: calEnd })
}

export function isCurrentMonth(date: Date, reference: Date): boolean {
  return isSameMonth(date, reference)
}

export function isTodayDate(date: Date): boolean {
  return isToday(date)
}

export function isSameDayDate(a: Date, b: Date): boolean {
  return isSameDay(a, b)
}

export function goNextMonth(date: Date): Date {
  return addMonths(date, 1)
}

export function goPrevMonth(date: Date): Date {
  return subMonths(date, 1)
}

export function getToday(): Date {
  return new Date()
}

export function dateToKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function keyToDate(key: string): Date {
  return parseISO(key)
}

export function getMonthDaysCount(date: Date): number {
  return eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) }).length
}

export function getDayOfWeek(date: Date): number {
  const day = getDay(date)
  return day === 0 ? 6 : day - 1
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}
