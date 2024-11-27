import { Note } from '../components'
import { useQueryParams } from '../hooks/useQueryParams'

export function NotePreview() {
  const params = useQueryParams()
  const sessionId = params.get('sessionId')
  const type = params.get('type')
  const id = params.get('id')
  const mockData = {
    content: 'This is a mocked note',
    title: 'My shared note',
  }

  return (
    <div>
      <h1>Note</h1>
      <p>Session ID: {sessionId}</p>
      <p>Type: {type}</p>
      <p>ID: {id}</p>
      <Note sessionId={sessionId!} {...mockData} id={id!} />
    </div>
  )
}
