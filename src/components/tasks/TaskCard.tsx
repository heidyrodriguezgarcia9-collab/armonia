import { Trash2, Edit3, ChevronDown, ChevronRight, Plus, Check } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { CategoryBadge } from '../ui/CategoryBadge'
import { PriorityBadge } from '../ui/PriorityBadge'
import { StatusBadge } from '../ui/StatusBadge'
import { useState } from 'react'
import type { Task } from '../../types'

interface TaskCardProps {
  task: Task
  compact?: boolean
}

export function TaskCard({ task, compact }: TaskCardProps) {
  const { categories, toggleTaskStatus, deleteTask, openTaskForm, toggleSubTask, addSubTask, removeSubTask } = useAppStore()
  const [expanded, setExpanded] = useState(false)
  const [newSubTask, setNewSubTask] = useState('')

  const category = categories.find((c) => c.id === task.categoryId)
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      addSubTask(task.id, newSubTask.trim())
      setNewSubTask('')
    }
  }

  return (
    <div className={`group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-sm transition-all duration-200 animate-fade-in ${task.status === 'completada' ? 'opacity-70' : ''}`}>
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.status === 'completada'
                ? 'bg-green-500 border-green-500'
                : task.status === 'en-progreso'
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {task.status === 'completada' && <Check className="w-3 h-3 text-white" />}
            {task.status === 'en-progreso' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={`font-medium text-sm ${task.status === 'completada' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {task.title}
                </h3>
                {task.description && !compact && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{task.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openTaskForm(task)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteTask(task.id)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {category && <CategoryBadge category={category} />}
              <PriorityBadge priority={task.priority} />
              {!compact && <StatusBadge status={task.status} />}
              {task.time && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {task.time}
                </span>
              )}
              {task.amount != null && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${task.paid ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                  ${task.amount.toFixed(2)} {task.paid ? '✓' : '⏳'}
                </span>
              )}
            </div>
          </div>
        </div>

        {!compact && task.subtasks.length > 0 && (
          <div className="mt-3 ml-8">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Subtareas ({completedSubtasks}/{task.subtasks.length})
            </button>
            {expanded && (
              <div className="mt-2 space-y-1">
                {task.subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 group/sub">
                    <button
                      onClick={() => toggleSubTask(task.id, st.id)}
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                        st.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {st.completed && <Check className="w-2.5 h-2.5 text-white" />}
                    </button>
                    <span className={`text-xs flex-1 ${st.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {st.text}
                    </span>
                    <button onClick={() => removeSubTask(task.id, st.id)} className="opacity-0 group-hover/sub:opacity-100 text-gray-300 hover:text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                    placeholder="Nueva subtarea..."
                    className="flex-1 text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:border-primary-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubTask()}
                  />
                  <button onClick={handleAddSubTask} className="text-primary-500 hover:text-primary-600">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
