import { IndexedDBHandler } from './IndexedDBHandler'
import { FirebaseStorageHandler } from './FirebaseStorageHandler'
import { StorageHandler } from './StorageHandler'
import { ListProps, NoteProps } from '../types'

export class DualStorageHandler implements StorageHandler {
  sessionId: string
  private indexedDBHandler: IndexedDBHandler
  private firebaseHandler: FirebaseStorageHandler

  constructor(sessionId: string) {
    this.sessionId = sessionId
    this.indexedDBHandler = new IndexedDBHandler(sessionId)
    this.firebaseHandler = new FirebaseStorageHandler(sessionId)
  }

  async initialize(): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.initialize(),
      this.firebaseHandler.initialize(),
    ])
  }

  // Sync function to synchronize local IndexedDB and Firebase
  async sync(): Promise<void> {
    // Sync Notes
    const localNotes = await this.indexedDBHandler.getNotes()
    const remoteNotes = await this.firebaseHandler.getNotes()

    // Sync local notes to Firebase
    for (const note of localNotes) {
      if (!remoteNotes.find((remote) => remote.id === note.id)) {
        await this.firebaseHandler.createNote(note)
      }
    }

    // Sync Firebase notes to IndexedDB
    for (const note of remoteNotes) {
      if (!localNotes.find((local) => local.id === note.id)) {
        await this.indexedDBHandler.createNote(note)
      }
    }

    // Sync Lists
    const localLists = await this.indexedDBHandler.getLists()
    const remoteLists = await this.firebaseHandler.getLists()

    // Sync local lists to Firebase
    for (const list of localLists) {
      if (!remoteLists.find((remote) => remote.id === list.id)) {
        await this.firebaseHandler.createList(list)
      }
    }

    // Sync Firebase lists to IndexedDB
    for (const list of remoteLists) {
      if (!localLists.find((local) => local.id === list.id)) {
        await this.indexedDBHandler.createList(list)
      }
    }
  }

  // Notes
  async createNote(note: NoteProps): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.createNote(note),
      this.firebaseHandler.createNote(note),
    ])
  }

  async getNote(id: string, isPublic?: boolean): Promise<NoteProps | undefined> {
    return this.indexedDBHandler.getNote(id, isPublic) ?? this.firebaseHandler.getNote(id, isPublic)
  }

  async getNotes(): Promise<NoteProps[]> {
    return this.indexedDBHandler.getNotes()
  }

  async updateNote(note: NoteProps): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.updateNote(note),
      this.firebaseHandler.updateNote(note),
    ])
  }

  async deleteNote(id: string): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.deleteNote(id),
      this.firebaseHandler.deleteNote(id),
    ])
  }

  // Lists
  async createList(list: ListProps): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.createList(list),
      this.firebaseHandler.createList(list),
    ])
  }

  async getList(id: string, isPublic?: boolean): Promise<ListProps | undefined> {
    return this.indexedDBHandler.getList(id, isPublic) ?? this.firebaseHandler.getList(id, isPublic)
  }

  async getLists(): Promise<ListProps[]> {
    return this.indexedDBHandler.getLists()
  }

  async updateList(list: ListProps): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.updateList(list),
      this.firebaseHandler.updateList(list),
    ])
  }

  async deleteList(id: string): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.deleteList(id),
      this.firebaseHandler.deleteList(id),
    ])
  }
}
