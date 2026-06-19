import { create } from 'zustand'
import type { Task, Category, SubTask, Priority, TaskStatus, ViewType } from '../types'
import { DEFAULT_CATEGORIES } from '../utils/constants'
import { generateId, dateToKey, getToday } from '../utils/helpers'
import * as firestore from '../firebase/firestore'

interface AppState {
  tasks: Task[]
  categories: Category[]
  user: { uid: string; displayName: string | null; photoURL: string | null } | null
  authLoading: boolean
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

interface AppActions {
  setUser: (user: AppState['user']) => void
  setAuthLoading: (v: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setActiveMonth: (month: string) => void
  setActiveView: (view: ViewType) => void
  setSelectedDay: (day: string | null) => void
  openDayModal: (day: string) => void
  closeDayModal: () => void
  openTaskForm: (task?: Task) => void
  closeTaskForm: () => void

  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskStatus: (id: string) => void
  toggleSubTask: (taskId: string, subTaskId: string) => void
  addSubTask: (taskId: string, text: string) => void
  removeSubTask: (taskId: string, subTaskId: string) => void

  addCategory: (data: Omit<Category, 'id'>) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void

  setSearchQuery: (query: string) => void
  setFilterCategory: (id: string | null) => void
  setFilterStatus: (status: TaskStatus | null) => void
  setFilterPriority: (priority: Priority | null) => void
  clearFilters: () => void

  loadUserData: (uid: string) => Promise<void>
  _saveToFirestore: () => void

  getTasksByDate: (date: string) => Task[]
  getTasksByMonth: (month: string) => Task[]
  getTodayTasks: () => Task[]
  getPendingPayments: () => Task[]
  getUpcomingTasks: (count?: number) => Task[]
  getCompletionRate: () => number
  getMonthlyExpenses: () => { total: number; paid: number; unpaid: number; byCategory: Record<string, number> }
  getOverdueTasks: () => Task[]
  searchTasks: (query: string) => Task[]
}

type AppStore = AppState & AppActions

function saveTheme(theme: string) {
  try { localStorage.setItem('armonia-theme', theme) } catch {}
}

function loadTheme(): string | null {
  try { return localStorage.getItem('armonia-theme') } catch { return null }
}

const today = getToday()

export const useAppStore = create<AppStore>((set, get) => ({
  tasks: [],
  categories: DEFAULT_CATEGORIES,
  user: null,
  authLoading: true,
  theme: loadTheme() === 'dark' ? 'dark' : 'light',
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

  setUser: (user) => set({ user }),
  setAuthLoading: (v) => set({ authLoading: v }),

  setTheme: (theme) => { set({ theme }); saveTheme(theme) },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: next })
    saveTheme(next)
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
    const task: Task = { ...taskData, id: generateId(), createdAt: now, updatedAt: now }
    set((s) => ({ tasks: [...s.tasks, task] }))
    get()._saveToFirestore()
  },
  updateTask: (id, data) => {
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
      ),
    }))
    get()._saveToFirestore()
  },
  deleteTask: (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    get()._saveToFirestore()
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
    get()._saveToFirestore()
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
    get()._saveToFirestore()
  },
  addSubTask: (taskId, text) => {
    const sub: SubTask = { id: generateId(), text, completed: false }
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, sub], updatedAt: new Date().toISOString() } : t
      ),
    }))
    get()._saveToFirestore()
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
    get()._saveToFirestore()
  },

  addCategory: (catData) => {
    const cat: Category = { ...catData, id: generateId() }
    set((s) => ({ categories: [...s.categories, cat] }))
    get()._saveToFirestore()
  },
  updateCategory: (id, data) => {
    set((s) => ({ categories: s.categories.map((c) => c.id === id ? { ...c, ...data } : c) }))
    get()._saveToFirestore()
  },
  deleteCategory: (id) => {
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      tasks: s.tasks.map((t) =>
        t.categoryId === id ? { ...t, categoryId: 'personal', updatedAt: new Date().toISOString() } : t
      ),
    }))
    get()._saveToFirestore()
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterCategory: (id) => set({ filterCategory: id }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  clearFilters: () => set({ searchQuery: '', filterCategory: null, filterStatus: null, filterPriority: null }),

  loadUserData: async (uid) => {
    try {
      const data = await firestore.loadUserData(uid)
      set({ tasks: data.tasks, categories: data.categories.length > 0 ? data.categories : DEFAULT_CATEGORIES })
    } catch (err) {
      console.error('Error loading user data:', err)
    }
  },

  _saveToFirestore: () => {
    const { user, tasks, categories } = get()
    if (user) {
      firestore.saveAllData(user.uid, tasks, categories).catch(console.error)
    }
  },

  getTasksByDate: (date) => get().tasks.filter((t) => t.date === date),
  getTasksByMonth: (month) => get().tasks.filter((t) => t.date.startsWith(month.substring(0, 7))),
  getTodayTasks: () => get().tasks.filter((t) => t.date === dateToKey(getToday())),
  getPendingPayments: () => get().tasks.filter((t) => {
    const cat = get().categories.find((c) => c.id === t.categoryId)
    return cat?.id === 'finance' && t.paid === false
  }),
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
}))
