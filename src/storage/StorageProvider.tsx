import React, { createContext, useContext, useEffect, useState } from 'react'
import { IndexedDBHandler } from './IndexedDBHandler'
import { StorageHandler } from './StorageHandler'

const StorageContext = createContext<StorageHandler | null>(null)

export const StorageProvider: React.FC<{ sessionId: string; children: React.ReactNode }> = ({ sessionId, children }) => {
  const [handler, setHandler] = useState<StorageHandler | null>(null)

  useEffect(() => {
    const initHandler = async () => {
      const dbHandler = new IndexedDBHandler(sessionId)
      await dbHandler.initialize()
      setHandler(dbHandler)
    }
    initHandler()
  }, [sessionId])

  if (!handler) {
    return (
      <div>
        <p>Loading storage...</p>
      </div>
    );
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
