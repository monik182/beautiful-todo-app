import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useQueryParams } from './hooks/useQueryParams'

type SessionContextType = {
  sessionId: string | null
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSessionContext = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

export const SessionProvider = ({ children }: { children: JSX.Element }) => {
  const params = useQueryParams()
  const hasInitialized = useRef(false)
  const [sessionId, setSession] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const sessionExpiry = localStorage.getItem('sessionExpiry')
      const now = new Date().getTime()

      if (sessionExpiry && now > parseInt(sessionExpiry)) {
        return null
      }
      return localStorage.getItem('sessionId')
    }
    return null
  })

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    if (!sessionId) {
      const now = new Date().getTime()
      const array = new Uint32Array(4)
      window.crypto.getRandomValues(array)
      const newSession = array.join('-')
      console.log('New session ID:', newSession)

      localStorage.setItem('sessionId', newSession)
      localStorage.setItem('sessionExpiry', (now + 30 * 24 * 60 * 60 * 1000).toString())
      setSession(newSession)
    }
  }, [sessionId])

  useEffect(() => {
    const id = params.get('sessionId');
    console.log('Setting session ID from param:', id)

    if (id) {
      localStorage.setItem('sessionId', id)
      localStorage.setItem('sessionExpiry', (new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toString())
    }
  }, [params])

  return (
    <SessionContext.Provider value={{ sessionId }}>
      {children}
    </SessionContext.Provider>
  )
}
