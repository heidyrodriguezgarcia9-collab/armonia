import { useAppStore } from '../store/useAppStore'
import { Dashboard } from '../components/dashboard/Dashboard'
import { CalendarGrid } from '../components/calendar/CalendarGrid'
import { AgendaList } from '../components/dashboard/AgendaList'
import { Finances } from '../components/finances/Finances'
import { SettingsPage } from '../components/settings/SettingsPage'
import { DayModal } from '../components/calendar/DayModal'
import { TaskForm } from '../components/tasks/TaskForm'

export function HomePage() {
  const activeView = useAppStore((s) => s.activeView)

  return (
    <div className="min-h-screen">
      {activeView === 'dashboard' && <Dashboard />}
      {activeView === 'calendar' && <CalendarGrid />}
      {activeView === 'list' && <AgendaList />}
      {activeView === 'finances' && <Finances />}
      {activeView === 'settings' && <SettingsPage />}
      <DayModal />
      <TaskForm />
    </div>
  )
}
