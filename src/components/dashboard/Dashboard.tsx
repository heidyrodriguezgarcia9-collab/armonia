import { CalendarDays, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { ProgressBar } from '../ui/ProgressBar'
import { CategoryBadge } from '../ui/CategoryBadge'
import { TaskCard } from '../tasks/TaskCard'
import { formatDateShort, keyToDate, getToday } from '../../utils/helpers'

export function Dashboard() {
  const {
    getTodayTasks, getUpcomingTasks, getPendingPayments, getCompletionRate,
    getOverdueTasks, categories, setActiveView,
  } = useAppStore()

  const todayTasks = getTodayTasks()
  const upcoming = getUpcomingTasks(3)
  const pendingPayments = getPendingPayments()
  const completionRate = getCompletionRate()
  const overdue = getOverdueTasks()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inicio</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDateShort(getToday())}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{todayTasks.length}</p>
              <p className="text-xs text-gray-500">Tareas hoy</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingPayments.length}</p>
              <p className="text-xs text-gray-500">Pagos pend.</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overdue.length}</p>
              <p className="text-xs text-gray-500">Vencidas</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completionRate}%</p>
              <p className="text-xs text-gray-500">Completado</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Progreso general</h3>
          <span className="text-xs text-gray-400">{completionRate}%</span>
        </div>
        <ProgressBar value={completionRate} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tareas de hoy</h3>
            <button onClick={() => setActiveView('calendar')} className="text-xs text-primary-500 hover:text-primary-600">Ver calendario</button>
          </div>
          <div className="space-y-2">
            {todayTasks.length === 0 ? (
              <div className="text-center py-6 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <CheckCircle2 className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-400">¡Día libre! Sin tareas pendientes</p>
              </div>
            ) : (
              todayTasks.map((t) => <TaskCard key={t.id} task={t} compact />)
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Próximas tareas</h3>
            <button onClick={() => setActiveView('list')} className="text-xs text-primary-500 hover:text-primary-600">Ver todas</button>
          </div>
          <div className="space-y-2">
            {upcoming.length === 0 ? (
              <div className="text-center py-6 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <CalendarDays className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-400">No hay próximas tareas</p>
              </div>
            ) : (
              upcoming.map((t) => (
                <div key={t.id} className="bg-white dark:bg-gray-800/30 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 text-center">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatDateShort(keyToDate(t.date))}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{t.title}</p>
                  </div>
                  {categories.find((c) => c.id === t.categoryId) && (
                    <CategoryBadge category={categories.find((c) => c.id === t.categoryId)!} dotOnly />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Tareas vencidas</h3>
          </div>
          <div className="space-y-2">
            {overdue.slice(0, 5).map((t) => <TaskCard key={t.id} task={t} compact />)}
          </div>
        </div>
      )}
    </div>
  )
}
