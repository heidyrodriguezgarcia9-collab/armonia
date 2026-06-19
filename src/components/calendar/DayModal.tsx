import { useAppStore } from '../../store/useAppStore'
import { Modal } from '../ui/Modal'
import { formatDateLong, keyToDate } from '../../utils/helpers'
import { TaskCard } from '../tasks/TaskCard'
import { Plus } from 'lucide-react'
import { Button } from '../ui/Button'

export function DayModal() {
  const { isDayModalOpen, selectedDay, closeDayModal, getTasksByDate, openTaskForm } = useAppStore()

  if (!isDayModalOpen || !selectedDay) return null

  const date = keyToDate(selectedDay)
  const dayTasks = getTasksByDate(selectedDay)

  return (
    <Modal isOpen={isDayModalOpen} onClose={closeDayModal} title={formatDateLong(date)}>
      <div className="p-5 space-y-3">
        {dayTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay tareas para este día</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-3"
              onClick={() => {
                closeDayModal()
                openTaskForm()
              }}
            >
              <Plus className="w-4 h-4" />
              Agregar tarea
            </Button>
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-400 font-medium">{dayTasks.length} tarea{dayTasks.length !== 1 ? 's' : ''}</div>
            {dayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </>
        )}
      </div>
    </Modal>
  )
}
