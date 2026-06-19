import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'finance',
    name: 'Económico',
    icon: 'wallet',
    color: 'cat-finance',
    isCustom: false,
  },
  {
    id: 'daughter',
    name: 'Hija',
    icon: 'heart',
    color: 'cat-daughter',
    isCustom: false,
  },
  {
    id: 'personal',
    name: 'Personal / Hogar',
    icon: 'home',
    color: 'cat-personal',
    isCustom: false,
  },
  {
    id: 'work',
    name: 'Trabajo',
    icon: 'briefcase',
    color: 'cat-work',
    isCustom: false,
  },
  {
    id: 'health',
    name: 'Salud',
    icon: 'activity',
    color: 'cat-health',
    isCustom: false,
  },
]

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'cat-finance': { bg: 'bg-cat-finance-bg dark:bg-emerald-900/30', text: 'text-cat-finance dark:text-emerald-300', dot: 'bg-cat-finance' },
  'cat-daughter': { bg: 'bg-cat-daughter-bg dark:bg-pink-900/30', text: 'text-cat-daughter dark:text-pink-300', dot: 'bg-cat-daughter' },
  'cat-personal': { bg: 'bg-cat-personal-bg dark:bg-amber-900/30', text: 'text-cat-personal dark:text-amber-300', dot: 'bg-cat-personal' },
  'cat-work': { bg: 'bg-cat-work-bg dark:bg-blue-900/30', text: 'text-cat-work dark:text-blue-300', dot: 'bg-cat-work' },
  'cat-health': { bg: 'bg-cat-health-bg dark:bg-red-900/30', text: 'text-cat-health dark:text-red-300', dot: 'bg-cat-health' },
}

export const PRIORITY_CONFIG = {
  alta: { label: 'Alta', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  media: { label: 'Media', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  baja: { label: 'Baja', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
}
