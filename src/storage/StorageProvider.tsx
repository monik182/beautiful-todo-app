import React, { createContext, useContext, useEffect, useState } from 'react'
import { IndexedDBHandler } from './IndexedDBHandler'
import { StorageHandler } from './StorageHandler'
import { FirebaseStorageHandler } from './FirebaseStorageHandler'

const StorageContext = createContext<StorageHandler | null>(null)

export const StorageProvider: React.FC<{ sessionId: string; useFirebase: boolean, children: React.ReactNode }> = ({ sessionId, useFirebase = true, children }) => {
  const [handler, setHandler] = useState<StorageHandler | null>(null)

  useEffect(() => {
    const initHandler = async () => {
      const storageHandler = useFirebase
        ? new FirebaseStorageHandler(sessionId)
        : new IndexedDBHandler(sessionId);
      await storageHandler.initialize();
      setHandler(storageHandler);
    };
    initHandler();
  }, [sessionId, useFirebase]);

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
