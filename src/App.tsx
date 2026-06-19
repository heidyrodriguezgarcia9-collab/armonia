import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'

function App() {
  const _hydrate = useAppStore((s) => s._hydrate)
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    _hydrate()
  }, [_hydrate])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <AppShell>
      <HomePage />
    </AppShell>
  )
}

export default App
