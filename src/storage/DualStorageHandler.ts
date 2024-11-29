import { IndexedDBHandler } from './IndexedDBHandler'
import { FirebaseStorageHandler } from './FirebaseStorageHandler'
import { StorageHandler } from './StorageHandler'
import { ListProps, NoteProps } from '../types'
import { FirebaseApp } from 'firebase/app'

export class DualStorageHandler implements StorageHandler {
  sessionId: string
  private indexedDBHandler: IndexedDBHandler
  private firebaseHandler: FirebaseStorageHandler

  constructor(sessionId: string, firebaseApp: FirebaseApp | null) {
    this.sessionId = sessionId
    this.indexedDBHandler = new IndexedDBHandler(sessionId)
    this.firebaseHandler = new FirebaseStorageHandler(sessionId, firebaseApp)
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
    const localMap = new Map(localLists.map((list) => [list.id, list]))

    // Sync remote lists to local
    for (const remoteList of remoteLists) {
      const localList = localMap.get(remoteList.id)
      if (!localList) {
        await this.indexedDBHandler.createList(remoteList)
      } else if (JSON.stringify(localList) !== JSON.stringify(remoteList)) {
        await this.indexedDBHandler.updateList(remoteList)
      }

      localMap.delete(remoteList.id)
    }

    // Sync local lists to remote
    for (const localList of localMap.values()) {
      await this.firebaseHandler.createList(localList)
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
    let note = await this.indexedDBHandler.getNote(id, isPublic)
    if (!note) {
      note = await this.firebaseHandler.getNote(id, isPublic)
    }
    return note
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
    let list = await this.indexedDBHandler.getList(id, isPublic)
    if (!list) {
      list = await this.firebaseHandler.getList(id, isPublic)
    }
    return list
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
