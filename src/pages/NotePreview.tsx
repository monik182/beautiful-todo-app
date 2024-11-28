import { useEffect, useState } from 'react'
import { Note } from '../components'
import { useQueryParams } from '../hooks/useQueryParams'
import { useStorage } from '../storage'
import { NoteProps } from '../types'

export function NotePreview() {
  const storage = useStorage()
  const params = useQueryParams()
  const id = params.get('id')
  const isPublic = !!params.get('public')
  const [note, setNote] = useState<NoteProps>()

  async function getNote() {
    const note = await storage.getNote(id!, isPublic)
    console.log('Note:', note)
    setNote(note)
  }

  useEffect(() => {
    if (id) {
      getNote()
    }
  }, [id])

  return (
    <div>
      {note && <Note {...note} id={id!} />}
    </div>
  )
}
