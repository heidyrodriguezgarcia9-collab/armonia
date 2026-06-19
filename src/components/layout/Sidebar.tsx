import { LayoutDashboard, CalendarDays, ListTodo, Wallet, Settings, Sun, Moon, Plus, LogOut } from 'lucide-react'
import type { ViewType } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { logOut } from '../../firebase/auth'

const navItems: { view: ViewType; label: string; icon: typeof LayoutDashboard }[] = [
  { view: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { view: 'calendar', label: 'Calendario', icon: CalendarDays },
  { view: 'list', label: 'Agenda', icon: ListTodo },
  { view: 'finances', label: 'Finanzas', icon: Wallet },
  { view: 'settings', label: 'Ajustes', icon: Settings },
]

export function Sidebar() {
  const { activeView, setActiveView, theme, toggleTheme, user } = useAppStore()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 fixed left-0 top-0 z-30">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
          <CalendarDays className="w-6 h-6" />
          Armonía
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Mi Agenda Personal</p>
      </div>

      {user && (
        <div className="px-4 pb-4 border-b border-gray-100 dark:border-gray-800 mx-3">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.displayName ?? 'Usuario'}</p>
        </div>
      )}

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeView === view
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        </button>
        <button
          onClick={() => logOut()}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export function TabBar() {
  const { activeView, setActiveView, openTaskForm, user } = useAppStore()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.slice(0, 4).map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              activeView === view
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
        <button
          onClick={() => setActiveView('settings')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
            activeView === 'settings'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">{user?.displayName?.split(' ')[0] ?? 'Ajustes'}</span>
        </button>
      </div>

      <button
        onClick={() => openTaskForm()}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/30 flex items-center justify-center hover:bg-primary-700 active:scale-95 transition-all duration-200"
      >
        <Plus className="w-6 h-6" />
      </button>
    </nav>
  )
}
