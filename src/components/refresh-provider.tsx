'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { refreshData } from '@/lib/actions'

interface RefreshContextType {
  refreshTrigger: number
  triggerRefresh: () => Promise<void>
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined)

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = useCallback(async () => {
    try {
      await refreshData()
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Failed to refresh data:', error)
    }
  }, [])

  return (
    <RefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}

export function useRefresh() {
  const context = useContext(RefreshContext)
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider')
  }
  return context
} 