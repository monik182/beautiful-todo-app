import { useEffect, useState, useCallback } from 'react'
import { useStorage } from '../storage'
import { ListProps, NoteProps } from '../types'
import { toaster } from '../components/ui/toaster'

export const useStorageManager = () => {
  const storage = useStorage()
  const [notes, setNotes] = useState<NoteProps[]>([])
  const [lists, setLists] = useState<ListProps[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    try {
      const fetchedNotes = await storage.getNotes()
      setNotes(fetchedNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }, [storage])

  const fetchLists = useCallback(async () => {
    try {
      const fetchedLists = await storage.getLists()
      setLists(fetchedLists)
    } catch (error) {
      console.error('Error fetching lists:', error)
    }
  }, [storage])

  const getNote = useCallback(async (id: string, isPublic: boolean) => {
    try {
      setLoading(true)
      return await storage.getNote(id, isPublic)
    } catch (error) {
      console.error('Error getting note:', error)
      toaster.create({
        title: 'Error Getting Note',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [storage])

  const getList = useCallback(async (id: string, isPublic: boolean) => {
    try {
      setLoading(true)
      return await storage.getList(id, isPublic)
    } catch (error) {
      console.error('Error getting list:', error)
      toaster.create({
        title: 'Error Getting List',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [storage])

  const createNote = useCallback(
    async (note: NoteProps) => {
      try {
        setLoading(true)
        await storage.createNote(note)
        await fetchNotes()
        toaster.create({
          title: 'Note Created Successfully',
          type: 'success',
        })
      } catch (error) {
        console.error('Error creating note:', error)
        toaster.create({
          title: 'Error Creating Note',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    },
    [storage, fetchNotes]
  )

  const updateNote = useCallback(
    async (note: NoteProps) => {
      try {
        setLoading(true)
        await storage.updateNote(note)
        await fetchNotes()
      } catch (error) {
        console.error('Error updating note:', error)
        toaster.create({
          title: 'Error Updating Note',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    },
    [storage, fetchNotes]
  )

  const deleteNote = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        await storage.deleteNote(id)
        await fetchNotes()
        toaster.create({
          title: 'Note Deleted Successfully',
          type: 'success',
        })
      } catch (error) {
        console.error('Error deleting note:', error)
        toaster.create({
          title: 'Error Deleting Note',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    },
    [storage, fetchNotes]
  )

  const createList = useCallback(
    async (list: ListProps) => {
      try {
        setLoading(true)
        await storage.createList(list)
        await fetchLists()
        toaster.create({
          title: 'List Created Successfully',
          type: 'success',
        })
      } catch (error) {
        console.error('Error creating list:', error)
        toaster.create({
          title: 'Error Creating List',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    },
    [storage, fetchLists]
  )

  const updateList = useCallback(
    async (list: ListProps) => {
      try {
        setLoading(true)
        await storage.updateList(list)
        await fetchLists()
      } catch (error) {
        console.error('Error updating list:', error)
        toaster.create({
          title: 'Error Updating List',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    },
    [storage, fetchLists]
  )

  const deleteList = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        await storage.deleteList(id)
        await fetchLists()
        toaster.create({
          title: 'List Deleted Successfully',
          type: 'success',
        })
      } catch (error) {
        console.error('Error deleting list:', error)
        toaster.create({
          title: 'Error Deleting List',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    },
    [storage, fetchLists]
  )

  const sync = useCallback(async () => {
    try {
      setLoading(true)
      await storage.sync?.()
      await fetchLists()
      await fetchNotes()
      toaster.create({
        title: 'Synced Successfully',
        type: 'success',
      })
    } catch (error) {
      console.error('Error syncing:', error)
      toaster.create({
        title: 'Error Syncing',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [fetchLists, fetchNotes, storage])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchNotes(), fetchLists()])
      setLoading(false)
    }

    fetchData()
  }, [fetchNotes, fetchLists])

  return {
    notes,
    lists,
    loading,
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
}
