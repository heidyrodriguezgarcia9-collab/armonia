import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import {
  getCalendarDays, formatMonthYear, formatDayNumber,
  isCurrentMonth, isTodayDate, goNextMonth, goPrevMonth, getToday, dateToKey, keyToDate,
} from '../../utils/helpers'
import { CATEGORY_COLORS } from '../../utils/constants'
import { generateICS, downloadICS } from '../../utils/ics'

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function CalendarGrid() {
  const { activeMonth, setActiveMonth, tasks, categories, openDayModal, selectedDay } = useAppStore()
  const currentDate = keyToDate(activeMonth)
  const days = getCalendarDays(currentDate)

  const today = getToday()

  const getTasksForDay = (day: Date) => {
    const key = dateToKey(day)
    return tasks.filter((t) => t.date === key)
  }

  const getCategoryDots = (day: Date) => {
    const dayTasks = getTasksForDay(day)
    const unique = new Set(dayTasks.map((t) => t.categoryId))
    return Array.from(unique).map((catId) => categories.find((c) => c.id === catId)).filter(Boolean)
  }

  const handlePrev = () => setActiveMonth(dateToKey(goPrevMonth(currentDate)))
  const handleNext = () => setActiveMonth(dateToKey(goNextMonth(currentDate)))
  const handleToday = () => setActiveMonth(dateToKey(today))

  const handleExportMonth = () => {
    const monthTasks = tasks.filter((t) => t.date.startsWith(activeMonth.substring(0, 7)))
    const ics = generateICS(monthTasks, categories, formatMonthYear(currentDate))
    downloadICS(ics, `armonia-${activeMonth}.ics`)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold capitalize text-gray-900 dark:text-gray-100">
            {formatMonthYear(currentDate)}
          </h2>
          <button
            onClick={handleToday}
            className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={handleExportMonth}
            className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
            title="Exportar mes al calendario"
          >
            <Download className="w-3 h-3" />
            Exportar
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNext} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
        {DAY_NAMES.map((name) => (
          <div key={name} className="bg-gray-50 dark:bg-gray-800/50 px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {name}
          </div>
        ))}

        {days.map((day, i) => {
          const key = dateToKey(day)
          const isCurrent = isCurrentMonth(day, currentDate)
          const isToday = isTodayDate(day)
          const isSelected = selectedDay === key
          const dayTasks = getTasksForDay(day)
          const dots = getCategoryDots(day)
          const hasOverdue = dayTasks.some((t) => t.date < dateToKey(today) && t.status !== 'completada')

          return (
            <button
              key={i}
              onClick={() => openDayModal(key)}
              className={`relative min-h-[60px] sm:min-h-[80px] p-1.5 text-left transition-all duration-150 group ${
                isCurrent ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'
              } ${isSelected ? 'ring-2 ring-primary-500 ring-inset z-10' : ''} hover:bg-primary-50/50 dark:hover:bg-primary-900/10`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${
                isToday
                  ? 'bg-primary-600 text-white font-bold'
                  : isCurrent
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-600'
              }`}>
                {formatDayNumber(day)}
              </span>

              {dots.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-1 px-0.5">
                  {dots.map((cat) => cat && (
                    <span
                      key={cat.id}
                      className={`block w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[cat.color]?.dot ?? 'bg-gray-300'}`}
                      title={cat.name}
                    />
                  ))}
                </div>
              )}

              {dayTasks.length > 0 && (
                <span className="absolute top-1 right-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                  {dayTasks.length}
                </span>
              )}

              {hasOverdue && (
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
