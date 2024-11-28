import React, { createContext, useContext, useEffect, useState } from 'react'
import { StorageHandler } from './StorageHandler'
import { DualStorageHandler } from './DualStorageHandler'

const StorageContext = createContext<StorageHandler | null>(null)

export const StorageProvider: React.FC<{ sessionId: string; useFirebase: boolean; children: React.ReactNode }> = ({ sessionId, useFirebase = true, children }) => {
  const [handler, setHandler] = useState<StorageHandler | null>(null)

  useEffect(() => {
    const initHandler = async () => {
      const storageHandler = new DualStorageHandler(sessionId)
      await storageHandler.initialize()
      setHandler(storageHandler)
    }
    initHandler()
  }, [sessionId])

  if (!handler) {
    return (
      <div>
        <p>Loading storage...</p>
      </div>
    )
  }

  return <StorageContext.Provider value={handler}>{children}</StorageContext.Provider>
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  return context
}
