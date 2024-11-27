import { ListProps, NoteProps } from '../types'

export interface StorageHandler {
  sessionId: string

  createNote: (note: NoteProps) => Promise<void>
  getNote: (id: string) => Promise<NoteProps | undefined>
  getNotes: () => Promise<NoteProps[]>
  updateNote: (note: NoteProps) => Promise<void>
  deleteNote: (id: string) => Promise<void>

  createList: (list: ListProps) => Promise<void>
  getList: (id: string) => Promise<ListProps | undefined>
  getLists: () => Promise<ListProps[]>
  updateList: (list: ListProps) => Promise<void>
  deleteList: (id: string) => Promise<void>
}
