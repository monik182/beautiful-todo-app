import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { StorageHandler } from './StorageHandler'
import { DualStorageHandler } from './DualStorageHandler'
import { ListProps, NoteProps } from '../types'
import { notifyError, notifySuccess } from './utils'

interface StorageContextType extends StorageHandler {
  notes: NoteProps[]
  lists: ListProps[]
  loading: boolean
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export const StorageProvider: React.FC<{ sessionId: string; useFirebase?: boolean; children: React.ReactNode }> = ({ sessionId, useFirebase = true, children }) => {
  const [handler, setHandler] = useState<StorageHandler | null>(null)
  const [notes, setNotes] = useState<NoteProps[]>([])
  const [lists, setLists] = useState<ListProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initHandler = async () => {
      const storageHandler = new DualStorageHandler(sessionId)
      await storageHandler.initialize()
      setHandler(storageHandler)
    }
    initHandler()
  }, [sessionId])

  const fetchNotes = useCallback(async () => {
    try {
      const fetchedNotes = await handler?.getNotes()
      setNotes(fetchedNotes || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }, [handler])

  const fetchLists = useCallback(async () => {
    try {
      const fetchedLists = await handler?.getLists()
      setLists(fetchedLists || [])
    } catch (error) {
      console.error('Error fetching lists:', error)
    }
  }, [handler])

  const sync = useCallback(async () => {
    try {
      setLoading(true)
      await handler?.sync?.()
      await fetchLists()
      await fetchNotes()
      notifySuccess('Synced Successfully')
    } catch (error) {
      console.error('Error syncing:', error)
      notifyError('Error syncing')
    } finally {
      setLoading(false)
    }
  }, [fetchLists, fetchNotes, handler])

  const getNote = useCallback(async (id: string, isPublic?: boolean) => {
    try {
      setLoading(true)
      return await handler?.getNote(id, isPublic)
    } catch (error) {
      console.error('Error getting note:', error)
      notifyError('Error getting note')
    } finally {
      setLoading(false)
    }
  }, [handler])

  const getList = useCallback(async (id: string, isPublic?: boolean) => {
    try {
      setLoading(true)
      return await handler?.getList(id, isPublic)
    } catch (error) {
      console.error('Error getting list:', error)
      notifyError('Error getting list')
    } finally {
      setLoading(false)
    }
  }, [handler])

  const createNote = useCallback(
    async (note: NoteProps) => {
      try {
        setLoading(true)
        await handler?.createNote(note)
        await fetchNotes()
        notifySuccess('Note Created Successfully')
      } catch (error) {
        console.error('Error creating note:', error)
        notifyError('Error creating note')
      } finally {
        setLoading(false)
      }
    },
    [handler, fetchNotes]
  )

  const updateNote = useCallback(
    async (note: NoteProps) => {
      try {
        setLoading(true)
        await handler?.updateNote(note)
        await fetchNotes()
      } catch (error) {
        console.error('Error updating note:', error)
        notifyError('Error updating note')
      } finally {
        setLoading(false)
      }
    },
    [handler, fetchNotes]
  )

  const deleteNote = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        await handler?.deleteNote(id)
        await fetchNotes()
        notifySuccess('Note Deleted Successfully')
      } catch (error) {
        console.error('Error deleting note:', error)
        notifyError('Error deleting note')
      } finally {
        setLoading(false)
      }
    },
    [handler, fetchNotes]
  )

  const createList = useCallback(
    async (list: ListProps) => {
      try {
        setLoading(true)
        await handler?.createList(list)
        await fetchLists()
        notifySuccess('List Created Successfully')
      } catch (error) {
        console.error('Error creating list:', error)
        notifyError('Error creating list')
      } finally {
        setLoading(false)
      }
    },
    [handler, fetchLists]
  )

  const updateList = useCallback(
    async (list: ListProps) => {
      try {
        setLoading(true)
        await handler?.updateList(list)
        await fetchLists()
      } catch (error) {
        console.error('Error updating list:', error)
        notifyError('Error updating list')
      } finally {
        setLoading(false)
      }
    },
    [handler, fetchLists]
  )

  const deleteList = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        await handler?.deleteList(id)
        await fetchLists()
        notifySuccess('List Deleted Successfully')
      } catch (error) {
        console.error('Error deleting list:', error)
        notifyError('Error deleting list')
      } finally {
        setLoading(false)
      }
    },
    [handler, fetchLists]
  )

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchNotes(), fetchLists()])
      setLoading(false)
    }

    fetchData()
  }, [fetchNotes, fetchLists])

  if (!handler) {
    return (
      <div>
        <p>Loading handler?...</p>
      </div>
    )
  }

  const value = {
    ...handler,
    notes,
    lists,
    loading,
    fetchNotes,
    fetchLists,
    sync,
    getNote,
    getList,
    createNote,
    updateNote,
    deleteNote,
    createList,
    updateList,
    deleteList,
  }

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  return context
}
