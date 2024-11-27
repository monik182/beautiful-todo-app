import { useEffect, useState } from 'react'
import { Note } from '../components'
import { useQueryParams } from '../hooks/useQueryParams'
import { useStorage } from '../storage'
import { NoteProps } from '../types'

export function NotePreview() {
  const storage = useStorage()
  const params = useQueryParams()
  const sessionId = params.get('sessionId')
  const id = params.get('id')
  const [note, setNote] = useState<NoteProps>()

  async function getNote() {
    const note = await storage.getNote(id!)
    console.log('Note:', note)
    setNote(note)
  }

  useEffect(() => {
    if (id) {
      getNote()
    }
  }, [sessionId, id])

  return (
    <div>
      {note && <Note sessionId={sessionId!} {...note} id={id!} />}
    </div>
  )
}
