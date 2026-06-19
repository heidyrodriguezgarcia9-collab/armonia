import React from 'react'
import { Sidebar, TabBar } from './Sidebar'
import { useAppStore } from '../../store/useAppStore'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const theme = useAppStore((s) => s.theme)

  return (
    <div className={`${theme} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Sidebar />
      <main className="lg:ml-64 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-4 lg:px-8 lg:py-6">
          {children}
        </div>
      </main>
      <TabBar />
    </div>
  )
}
