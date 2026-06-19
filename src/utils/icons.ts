import { type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {}

export function getIconByName(name: string): LucideIcon | null {
  return iconMap[name] ?? null
}

export { iconMap }
