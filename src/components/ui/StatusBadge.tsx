import type { TaskStatus } from '../../types'

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  'pendiente': { label: 'Pendiente', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
  'en-progreso': { label: 'En progreso', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  'completada': { label: 'Completada', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      {status === 'completada' ? '✓' : status === 'en-progreso' ? '◐' : '○'} {config.label}
    </span>
  )
}
