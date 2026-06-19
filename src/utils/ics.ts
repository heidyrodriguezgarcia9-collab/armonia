import type { Task, Category } from '../types'

function formatICalDate(dateStr: string, timeStr?: string): string {
  const parts = dateStr.split('-').map(Number)
  if (timeStr) {
    const [h, m] = timeStr.split(':').map(Number)
    return `${parts[0]}${String(parts[1]).padStart(2, '0')}${String(parts[2]).padStart(2, '0')}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`
  }
  return `${parts[0]}${String(parts[1]).padStart(2, '0')}${String(parts[2]).padStart(2, '0')}`
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

const PRIORITY_MAP: Record<string, number> = {
  alta: 1,
  media: 5,
  baja: 9,
}

export function generateICS(tasks: Task[], categories: Category[], scope: string = 'all'): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Armonía//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Armonía - ' + scope,
  ]

  const now = new Date()
  const nowStr = formatICalDate(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  )

  for (const task of tasks) {
    const category = categories.find((c) => c.id === task.categoryId)
    const catName = category?.name ?? 'General'
    const dateStart = formatICalDate(task.date, task.time)
    const dateEnd = task.time
      ? (() => {
          const [h, m] = task.time.split(':').map(Number)
          const endH = (h + 1) % 24
          return formatICalDate(task.date, `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
        })()
      : formatICalDate(task.date)

    const statusLabels: Record<string, string> = {
      'pendiente': 'Pendiente',
      'en-progreso': 'En progreso',
      'completada': 'Completada',
    }

    const desc = [
      task.description && `Descripción: ${task.description}`,
      `Categoría: ${catName}`,
      `Prioridad: ${task.priority}`,
      `Estado: ${statusLabels[task.status] ?? task.status}`,
      task.amount != null && `Monto: $${task.amount.toFixed(2)}${task.paid ? ' (Pagado)' : ' (Pendiente)'}`,
      task.subtasks.length > 0 && `Subtareas: ${task.subtasks.filter((st) => st.completed).length}/${task.subtasks.length}`,
      task.recurrence !== 'no-repite' && `Repite: ${task.recurrence}`,
      task.notes && `Notas: ${task.notes}`,
    ]
      .filter(Boolean)
      .join('\\n')

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${task.id}@armonia.app`)
    if (task.time) {
      lines.push(`DTSTART:${dateStart}`)
      lines.push(`DTEND:${dateEnd}`)
    } else {
      lines.push(`DTSTART;VALUE=DATE:${dateStart}`)
      lines.push(`DTEND;VALUE=DATE:${dateEnd}`)
    }
    lines.push(`DTSTAMP:${nowStr}`)
    lines.push(`CREATED:${task.createdAt.replace(/[-:]/g, '').split('.')[0]}Z`)
    lines.push(`SUMMARY:${escapeICalText(task.title)}`)
    lines.push(`DESCRIPTION:${desc}`)
    lines.push(`CATEGORIES:${catName}`)
    lines.push(`PRIORITY:${PRIORITY_MAP[task.priority] ?? 5}`)
    lines.push(`STATUS:${task.status === 'completada' ? 'COMPLETED' : task.status === 'en-progreso' ? 'IN-PROCESS' : 'TENTATIVE'}`)
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadICS(content: string, filename: string = 'armonia-calendario.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
