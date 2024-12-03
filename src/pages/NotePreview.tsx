import { useEffect, useState } from 'react'
import { Note } from '../components'
import { useQueryParams } from '../hooks/useQueryParams'
import { NoteProps } from '../types'
import { useStorage, useSessionContext, useAuth } from '../providers'
import { EmptyState } from '../components/ui/empty-state'
import { SlNote } from 'react-icons/sl'
import { Button, Flex, Link } from '@chakra-ui/react'
import { notifyError, notifySuccess } from '../utils'
import { Alert } from '../components/ui/alert'

export function NotePreview() {
  const params = useQueryParams()
  const { user } = useAuth()
  const { sessionId } = useSessionContext()
  const { getNote, updateNote } = useStorage()
  const id = params.get('id')
  const isPublic = !!params.get('public')
  const canEdit = !!params.get('edit')
  const [note, setNote] = useState<NoteProps>()
  const isOwner = note?.uid === user?.uid || note?.sessionId === sessionId
  const sharedWithUser = note?.allowedUsers?.includes(user?.uid || sessionId || '')
  const showAddButton = !isOwner && !sharedWithUser

  const add = () => {
    if (!note || !sessionId || note.sessionId === sessionId) return
    const allowedUsers = note?.allowedUsers || []
    try {
      const updatedNote = { ...note, allowedUsers: [...allowedUsers, (user?.uid || sessionId)] }
      updateNote(updatedNote)
      setNote(updatedNote)
      notifySuccess('Note added to your notes')
    } catch (error) {
      console.error('Error adding note:', error)
      notifyError('Error adding note')
    }
  }

  useEffect(() => {
    async function getData(id: string) {
      const note = await getNote(id, isPublic)
      setNote(note)
    }

    if (id) {
      getData(id)
    }
  }, [id])
  

  if (!note) {
    return (
      <EmptyState
        icon={<SlNote />}
        title="Note not found"
        description="The note you are looking for does not exist. You might be logged out or the note is private."
      >
        <Flex gap="5px">
          <span>Create a</span> <Link href="/?tab=notes">new note</Link>
        </Flex>
      </EmptyState>
    )
  }

  return (
    <div>
      <Note {...note} onChange={canEdit ? updateNote : undefined} />
      {showAddButton && (
        <Flex justify="center" margin="1rem" width="100%">
          <Button variant="outline" colorPalette="orange" size="xl" onClick={add}>Add to my notes</Button>
        </Flex>
      )}
      {sharedWithUser && (
        <Alert status="success" title="This note is already saved in your notes" marginTop="1rem" />
      )}
    </div>
  )
}
