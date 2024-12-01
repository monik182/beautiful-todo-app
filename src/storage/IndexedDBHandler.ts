import { openDB, IDBPDatabase } from "idb"
import { StorageHandler } from './StorageHandler'
import { ListProps, NoteProps } from '../types'

const DB_NAME = "AppDatabase"
const DB_VERSION = 1

export class IndexedDBHandler implements StorageHandler {
  private db: IDBPDatabase
  private dbPromise: Promise<IDBPDatabase>
  sessionId: string
  uid?: string

  constructor(sessionId: string, uid?: string) {
    this.uid = uid
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

  private canAccess(resourceSessionId: string, resourceUID?: string) {
    if (resourceUID) {
      return resourceUID === this.uid
    }
    return resourceSessionId === this.sessionId
  }

  private isAllowedUser(resourceAllowedUsers: string[] = []) {
    return (this.uid && resourceAllowedUsers.includes(this.uid)) || resourceAllowedUsers.includes(this.sessionId)
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
    const canAccessNote = this.canAccess(note.sessionId, note.uid) || this.isAllowedUser(note.allowedUsers)
    return canAccessNote ? note : undefined
  }

  async getNotes(): Promise<NoteProps[]> {
    const notes = await this.db.getAll("notes")
    return notes.filter((note) => this.canAccess(note.sessionId, note.uid) || this.isAllowedUser(note.allowedUsers))
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
    const canAccessList = this.canAccess(list.sessionId, list.uid) || this.isAllowedUser(list.allowedUsers)
    return canAccessList ? list : undefined
  }

  async getLists(): Promise<ListProps[]> {
    const lists = await this.db.getAll("lists")
    return lists.filter((list) => this.canAccess(list.sessionId, list.uid) || this.isAllowedUser(list.allowedUsers))
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

  async clear() {
    await this.db.clear("notes")
    await this.db.clear("lists")
  }
}
