import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './components/auth/LoginPage'
import { onAuthChange } from './firebase/auth'
import { Loader2 } from 'lucide-react'

function App() {
  const user = useAppStore((s) => s.user)
  const authLoading = useAppStore((s) => s.authLoading)
  const theme = useAppStore((s) => s.theme)
  const setUser = useAppStore((s) => s.setUser)
  const setAuthLoading = useAppStore((s) => s.setAuthLoading)
  const loadUserData = useAppStore((s) => s.loadUserData)

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        })
        await loadUserData(firebaseUser.uid)
      } else {
        setUser(null)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [setUser, setAuthLoading, loadUserData])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
          <p className="text-sm text-gray-400 mt-2">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <AppShell>
      <HomePage />
    </AppShell>
  )
}

export default App
