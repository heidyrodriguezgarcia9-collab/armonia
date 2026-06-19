import { create } from 'zustand'
import type { Task, Category, SubTask, Priority, TaskStatus, ViewType, AppState } from '../types'
import { DEFAULT_CATEGORIES } from '../utils/constants'
import { generateId, dateToKey, getToday } from '../utils/helpers'

interface AppActions {
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setActiveMonth: (month: string) => void
  setActiveView: (view: ViewType) => void
  setSelectedDay: (day: string | null) => void
  openDayModal: (day: string) => void
  closeDayModal: () => void
  openTaskForm: (task?: Task) => void
  closeTaskForm: () => void

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskStatus: (id: string) => void
  toggleSubTask: (taskId: string, subTaskId: string) => void
  addSubTask: (taskId: string, text: string) => void
  removeSubTask: (taskId: string, subTaskId: string) => void

  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void

  setSearchQuery: (query: string) => void
  setFilterCategory: (id: string | null) => void
  setFilterStatus: (status: TaskStatus | null) => void
  setFilterPriority: (priority: Priority | null) => void
  clearFilters: () => void

  getTasksByDate: (date: string) => Task[]
  getTasksByMonth: (month: string) => Task[]
  getTodayTasks: () => Task[]
  getPendingPayments: () => Task[]
  getUpcomingTasks: (count?: number) => Task[]
  getCompletionRate: () => number
  getMonthlyExpenses: () => { total: number; paid: number; unpaid: number; byCategory: Record<string, number> }
  getOverdueTasks: () => Task[]
  searchTasks: (query: string) => Task[]

  _hydrate: () => void
}

type AppStore = AppState & AppActions

function loadState(): Partial<AppState> {
  try {
    const saved = localStorage.getItem('armonia-store')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {}
  return {}
}

function saveState(state: AppState) {
  try {
    localStorage.setItem('armonia-store', JSON.stringify({
      tasks: state.tasks,
      categories: state.categories,
      theme: state.theme,
    }))
  } catch {}
}

const today = getToday()

export const useAppStore = create<AppStore>((set, get) => ({
  tasks: [],
  categories: DEFAULT_CATEGORIES,
  theme: 'light',
  activeMonth: dateToKey(today),
  activeView: 'dashboard',
  selectedDay: null,
  isDayModalOpen: false,
  editingTask: null,
  isTaskFormOpen: false,
  searchQuery: '',
  filterCategory: null,
  filterStatus: null,
  filterPriority: null,

  setTheme: (theme) => {
    set({ theme })
    saveState(get())
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: next })
    saveState(get())
  },
  setActiveMonth: (month) => set({ activeMonth: month }),
  setActiveView: (view) => set({ activeView: view }),
  setSelectedDay: (day) => set({ selectedDay: day }),
  openDayModal: (day) => set({ selectedDay: day, isDayModalOpen: true }),
  closeDayModal: () => set({ isDayModalOpen: false, selectedDay: null }),
  openTaskForm: (task) => set({ editingTask: task ?? null, isTaskFormOpen: true }),
  closeTaskForm: () => set({ isTaskFormOpen: false, editingTask: null }),

  addTask: (taskData) => {
    const now = new Date().toISOString()
    const task: Task = {
      ...taskData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({ tasks: [...s.tasks, task] }))
    saveState(get())
  },
  updateTask: (id, data) => {
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
      ),
    }))
    saveState(get())
  },
  deleteTask: (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    saveState(get())
  },
  toggleTaskStatus: (id) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id !== id) return t
        const nextStatus: Record<TaskStatus, TaskStatus> = {
          'pendiente': 'en-progreso',
          'en-progreso': 'completada',
          'completada': 'pendiente',
        }
        return { ...t, status: nextStatus[t.status], updatedAt: new Date().toISOString() }
      }),
    }))
    saveState(get())
  },
  toggleSubTask: (taskId, subTaskId) => {
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id !== taskId ? t : {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          ),
          updatedAt: new Date().toISOString(),
        }
      ),
    }))
    saveState(get())
  },
  addSubTask: (taskId, text) => {
    const sub: SubTask = { id: generateId(), text, completed: false }
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, sub], updatedAt: new Date().toISOString() } : t
      ),
    }))
    saveState(get())
  },
  removeSubTask: (taskId, subTaskId) => {
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id !== taskId ? t : {
          ...t,
          subtasks: t.subtasks.filter((st) => st.id !== subTaskId),
          updatedAt: new Date().toISOString(),
        }
      ),
    }))
    saveState(get())
  },

  addCategory: (catData) => {
    const cat: Category = { ...catData, id: generateId() }
    set((s) => ({ categories: [...s.categories, cat] }))
    saveState(get())
  },
  updateCategory: (id, data) => {
    set((s) => ({
      categories: s.categories.map((c) => c.id === id ? { ...c, ...data } : c),
    }))
    saveState(get())
  },
  deleteCategory: (id) => {
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      tasks: s.tasks.map((t) => t.categoryId === id ? { ...t, categoryId: 'personal', updatedAt: new Date().toISOString() } : t),
    }))
    saveState(get())
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterCategory: (id) => set({ filterCategory: id }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  clearFilters: () => set({ searchQuery: '', filterCategory: null, filterStatus: null, filterPriority: null }),

  getTasksByDate: (date) => {
    return get().tasks.filter((t) => t.date === date)
  },
  getTasksByMonth: (month) => {
    return get().tasks.filter((t) => t.date.startsWith(month.substring(0, 7)))
  },
  getTodayTasks: () => {
    return get().tasks.filter((t) => t.date === dateToKey(getToday()))
  },
  getPendingPayments: () => {
    return get().tasks.filter((t) => {
      const cat = get().categories.find((c) => c.id === t.categoryId)
      return cat?.id === 'finance' && t.paid === false
    })
  },
  getUpcomingTasks: (count = 3) => {
    const todayKey = dateToKey(getToday())
    return get().tasks
      .filter((t) => t.date >= todayKey && t.status !== 'completada')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, count)
  },
  getCompletionRate: () => {
    const tasks = get().tasks
    if (tasks.length === 0) return 0
    return Math.round((tasks.filter((t) => t.status === 'completada').length / tasks.length) * 100)
  },
  getMonthlyExpenses: () => {
    const month = get().activeMonth.substring(0, 7)
    const monthlyTasks = get().tasks.filter((t) => t.date.startsWith(month))
    const financeTasks = monthlyTasks.filter((t) => {
      const cat = get().categories.find((c) => c.id === t.categoryId)
      return cat?.id === 'finance' && t.amount != null
    })
    const byCategory: Record<string, number> = {}
    let total = 0
    let paid = 0
    financeTasks.forEach((t) => {
      total += t.amount ?? 0
      if (t.paid) paid += t.amount ?? 0
      const catName = get().categories.find((c) => c.id === t.categoryId)?.name ?? 'General'
      byCategory[catName] = (byCategory[catName] ?? 0) + (t.amount ?? 0)
    })
    return { total, paid, unpaid: total - paid, byCategory }
  },
  getOverdueTasks: () => {
    const todayKey = dateToKey(getToday())
    return get().tasks.filter((t) => t.date < todayKey && t.status !== 'completada')
  },
  searchTasks: (query) => {
    const q = query.toLowerCase()
    return get().tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.notes.toLowerCase().includes(q)
    )
  },

  _hydrate: () => {
    const saved = loadState()
    if (saved.tasks) set({ tasks: saved.tasks })
    if (saved.categories) set({ categories: saved.categories })
    if (saved.theme) set({ theme: saved.theme })
  },
}))
