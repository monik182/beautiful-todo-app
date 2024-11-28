import { useEffect, useState } from 'react'
import { Note } from '../components'
import { useQueryParams } from '../hooks/useQueryParams'
import { NoteProps } from '../types'
import { useStorageManager } from '../hooks/useStorageManager'

export function NotePreview() {
  const { getNote, updateNote } = useStorageManager()
  const params = useQueryParams()
  const id = params.get('id')
  const isPublic = !!params.get('public')
  const canEdit = !!params.get('edit')
  const [note, setNote] = useState<NoteProps>()
  
  useEffect(() => {
    async function getData(id: string) {
      const note = await getNote(id, isPublic)
      console.log('Note:', note)
      setNote(note)
    }

    if (id) {
      getData(id)
    }
  }, [id])

  return (
    <div>
      {note && <Note {...note} onChange={canEdit ? updateNote : undefined} />}
    </div>
  )
}
