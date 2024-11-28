import { useEffect, useState, useCallback } from 'react'
import { useStorage } from '../storage'
import { ListProps, NoteProps } from '../types'

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

  const createNote = useCallback(
    async (note: NoteProps) => {
      try {
        setLoading(true)
        await storage.createNote(note)
        await fetchNotes()
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
    } finally {
      setLoading(false)
    }
  }, [])

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
    createNote,
    updateNote,
    deleteNote,
    createList,
    updateList,
    deleteList,
  }
}
