import { useAppStore } from '../../store/useAppStore'
import { TaskCard } from '../tasks/TaskCard'
import { Button } from '../ui/Button'
import { Search, X, SlidersHorizontal, ListTodo } from 'lucide-react'
import { useState } from 'react'
import type { Priority, TaskStatus } from '../../types'

export function AgendaList() {
  const {
    tasks, activeMonth, searchQuery, setSearchQuery,
    filterCategory, setFilterCategory, filterStatus, setFilterStatus,
    filterPriority, setFilterPriority, clearFilters, categories,
  } = useAppStore()

  const [showFilters, setShowFilters] = useState(false)

  const monthTasks = tasks
    .filter((t) => t.date.startsWith(activeMonth.substring(0, 7)))
    .filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      }
      return true
    })
    .filter((t) => !filterCategory || t.categoryId === filterCategory)
    .filter((t) => !filterStatus || t.status === filterStatus)
    .filter((t) => !filterPriority || t.priority === filterPriority)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))

  const groupedByDate: Record<string, typeof tasks> = {}
  monthTasks.forEach((t) => {
    if (!groupedByDate[t.date]) groupedByDate[t.date] = []
    groupedByDate[t.date].push(t)
  })

  const hasActiveFilters = !!(searchQuery || filterCategory || filterStatus || filterPriority)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Agenda</h1>
        <Button
          variant={hasActiveFilters ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar tareas..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-primary-500 hover:text-primary-600">Limpiar filtros</button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory ?? ''}
              onChange={(e) => setFilterCategory(e.target.value || null)}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none"
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filterStatus ?? ''}
              onChange={(e) => setFilterStatus((e.target.value || null) as TaskStatus | null)}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-progreso">En progreso</option>
              <option value="completada">Completada</option>
            </select>
            <select
              value={filterPriority ?? ''}
              onChange={(e) => setFilterPriority((e.target.value || null) as Priority | null)}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none"
            >
              <option value="">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
      )}

      {Object.keys(groupedByDate).length === 0 ? (
        <div className="text-center py-16">
          <ListTodo className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No hay tareas en este mes</p>
          <p className="text-xs text-gray-400 mt-1">Crea una tarea desde el botón +</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, dateTasks]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                <span className="text-[10px] text-gray-400">{dateTasks.length}</span>
              </div>
              <div className="space-y-2">
                {dateTasks.map((t) => <TaskCard key={t.id} task={t} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
