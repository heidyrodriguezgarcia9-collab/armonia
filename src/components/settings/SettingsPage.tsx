import { useAppStore } from '../../store/useAppStore'
import { Button } from '../ui/Button'
import { Sun, Moon, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Category } from '../../types'
import { CATEGORY_COLORS } from '../../utils/constants'

const COLOR_OPTIONS = ['cat-finance', 'cat-daughter', 'cat-personal', 'cat-work', 'cat-health', 'primary']

export function SettingsPage() {
  const { theme, toggleTheme, categories, addCategory, updateCategory, deleteCategory } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('primary')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    addCategory({ name: newName.trim(), icon: 'star', color: newColor, isCustom: true })
    setNewName('')
    setShowAdd(false)
  }

  const handleEdit = (cat: Category) => {
    updateCategory(cat.id, { name: editName.trim() })
    setEditingId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ajustes</h1>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 divide-y divide-gray-100 dark:divide-gray-700/50">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              {theme === 'light' ? <Sun className="w-5 h-5 text-primary-500" /> : <Moon className="w-5 h-5 text-primary-500" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Modo {theme === 'light' ? 'claro' : 'oscuro'}</p>
              <p className="text-xs text-gray-500">Cambiar apariencia de la app</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categorías</h2>
          <Button size="sm" variant="primary" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" />
            Nueva
          </Button>
        </div>

        {showAdd && (
          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 mb-3 animate-fade-in">
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre de la categoría"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <div>
                <p className="text-xs text-gray-500 mb-2">Color</p>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={`w-7 h-7 rounded-full ${CATEGORY_COLORS[color]?.dot || 'bg-primary-500'} ${newColor === color ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-900' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Cancelar</Button>
                <Button size="sm" onClick={handleAdd}>Guardar</Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat.color]?.dot || 'bg-primary-500'}`} />
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-2 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit(cat)}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
                )}
                {!cat.isCustom && (
                  <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">fija</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {editingId === cat.id ? (
                  <>
                    <Button size="sm" onClick={() => handleEdit(cat)}>OK</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    {cat.isCustom && (
                      <>
                        <button
                          onClick={() => { setEditingId(cat.id); setEditName(cat.name) }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <p className="text-xs text-gray-400 text-center">
          Armonía v1.0 — Tu agenda personal inteligente
        </p>
      </div>
    </div>
  )
}
