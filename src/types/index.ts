export type Priority = 'alta' | 'media' | 'baja'
export type TaskStatus = 'pendiente' | 'en-progreso' | 'completada'
export type Recurrence = 'no-repite' | 'diaria' | 'semanal' | 'quincenal' | 'mensual' | 'anual'
export type ViewType = 'dashboard' | 'calendar' | 'list' | 'finances' | 'settings'

export interface SubTask {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  categoryId: string
  date: string
  time?: string
  amount?: number
  paid?: boolean
  priority: Priority
  recurrence: Recurrence
  status: TaskStatus
  subtasks: SubTask[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  isCustom: boolean
}

export interface AppState {
  tasks: Task[]
  categories: Category[]
  theme: 'light' | 'dark'
  activeMonth: string
  activeView: ViewType
  selectedDay: string | null
  isDayModalOpen: boolean
  editingTask: Task | null
  isTaskFormOpen: boolean
  searchQuery: string
  filterCategory: string | null
  filterStatus: TaskStatus | null
  filterPriority: Priority | null
}
