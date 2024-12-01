import { ListProps, NoteProps } from '../types'

export interface StorageHandler {
  sessionId: string
  uid?: string

  createNote: (note: NoteProps) => Promise<void>
  getNote: (id: string, isPublic?: boolean) => Promise<NoteProps | undefined>
  getNotes: () => Promise<NoteProps[]>
  updateNote: (note: NoteProps) => Promise<void>
  deleteNote: (id: string) => Promise<void>

  createList: (list: ListProps) => Promise<void>
  getList: (id: string, isPublic?: boolean) => Promise<ListProps | undefined>
  getLists: () => Promise<ListProps[]>
  updateList: (list: ListProps) => Promise<void>
  deleteList: (id: string) => Promise<void>
  clear: () => Promise<void>
  sync?: () => Promise<void>
  loginSync?: (uid?: string) => Promise<void>
  hasUid?: () => boolean
}
