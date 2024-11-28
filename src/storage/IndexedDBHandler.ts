import { openDB, IDBPDatabase } from "idb"
import { StorageHandler } from './StorageHandler'
import { ListProps, NoteProps } from '../types'

const DB_NAME = "AppDatabase"
const DB_VERSION = 1

export class IndexedDBHandler implements StorageHandler {
  private db: IDBPDatabase
  private dbPromise: Promise<IDBPDatabase>
  sessionId: string

  constructor(sessionId: string) {
    this.sessionId = sessionId
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("notes")) {
          db.createObjectStore("notes", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("lists")) {
          db.createObjectStore("lists", { keyPath: "id" })
        }
      },
    })
    this.db = {} as IDBPDatabase
  }

  async initialize() {
    this.db = await this.dbPromise
  }

  // Note CRUD
  async createNote(note: NoteProps): Promise<void> {
    await this.db.put("notes", note)
  }

  async getNote(id: string, isPublic = false): Promise<NoteProps | undefined> {
    const note = await this.db.get("notes", id)
    if (isPublic) {
      return note
    }
    const canAccessNote = note?.sessionId === this.sessionId || (note?.allowedUsers && note.allowedUsers.includes(this.sessionId))
    return canAccessNote ? note : undefined
  }

  async getNotes(): Promise<NoteProps[]> {
    const notes = await this.db.getAll("notes")
    return notes.filter((note) => note.sessionId === this.sessionId || (note.allowedUsers && note.allowedUsers.includes(this.sessionId)))
  }

  async updateNote(note: NoteProps): Promise<void> {
    const existingNote = await this.getNote(note.id)
    if (existingNote) {
      await this.db.put("notes", note)
    }
  }

  async deleteNote(id: string): Promise<void> {
    const existingNote = await this.getNote(id)
    if (existingNote) {
      await this.db.delete("notes", id)
    }
  }

  // List CRUD
  async createList(list: ListProps): Promise<void> {
    await this.db.put("lists", list)
  }

  async getList(id: string, isPublic = false): Promise<ListProps | undefined> {
    const list = await this.db.get("lists", id)
    if (isPublic) {
      return list
    }
    const canAccessList = list?.sessionId === this.sessionId || (list?.allowedUsers && list.allowedUsers.includes(this.sessionId))
    return canAccessList ? list : undefined
  }

  async getLists(): Promise<ListProps[]> {
    const lists = await this.db.getAll("lists")
    return lists.filter((list) => list.sessionId === this.sessionId || (list.allowedUsers && list.allowedUsers.includes(this.sessionId)))
  }

  async updateList(list: ListProps): Promise<void> {
    const existingList = await this.getList(list.id)
    if (existingList) {
      await this.db.put("lists", list)
    }
  }

  async deleteList(id: string): Promise<void> {
    const existingList = await this.getList(id)
    if (existingList) {
      await this.db.delete("lists", id)
    }
  }
}
