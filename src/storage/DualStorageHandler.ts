import { IndexedDBHandler } from './IndexedDBHandler'
import { FirebaseStorageHandler } from './FirebaseStorageHandler'
import { StorageHandler } from './StorageHandler'
import { ListProps, NoteProps } from '../types'
import { FirebaseApp } from 'firebase/app'

export class DualStorageHandler implements StorageHandler {
  uid?: string
  sessionId: string
  private indexedDBHandler: IndexedDBHandler
  private firebaseHandler: FirebaseStorageHandler

  constructor(sessionId: string, firebaseApp: FirebaseApp | null, uid?: string) {
    this.sessionId = sessionId
    this.indexedDBHandler = new IndexedDBHandler(sessionId, uid)
    this.firebaseHandler = new FirebaseStorageHandler(sessionId, firebaseApp, uid)
    this.uid = uid
  }

  async initialize(): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.initialize(),
      this.firebaseHandler.initialize(),
    ])
  }

  async sync(): Promise<void> {
    const localNotes = await this.indexedDBHandler.getNotes();
    const remoteNotes = await this.firebaseHandler.getNotes();
    const localNotesMap = new Map(localNotes.map((note) => [note.id, note]));

    for (const remoteNote of remoteNotes) {
      const localNote = localNotesMap.get(remoteNote.id);

      if (!localNote) {
        await this.indexedDBHandler.createNote(remoteNote);
      } else if (JSON.stringify(localNote) !== JSON.stringify(remoteNote)) {
        await this.indexedDBHandler.updateNote(remoteNote);
      }

      localNotesMap.delete(remoteNote.id);
    }

    for (const localNote of localNotesMap.values()) {
      await this.firebaseHandler.createNote(localNote);
    }

    const localLists = await this.indexedDBHandler.getLists();
    const remoteLists = await this.firebaseHandler.getLists();
    const localListsMap = new Map(localLists.map((list) => [list.id, list]));

    for (const remoteList of remoteLists) {
      const localList = localListsMap.get(remoteList.id);

      if (!localList) {
        await this.indexedDBHandler.createList(remoteList);
      } else if (JSON.stringify(localList) !== JSON.stringify(remoteList)) {
        await this.indexedDBHandler.updateList(remoteList);
      }

      localListsMap.delete(remoteList.id);
    }

    for (const localList of localListsMap.values()) {
      await this.firebaseHandler.createList(localList);
    }
  }

  async loginSync(): Promise<void> {
    const localNotes = await this.indexedDBHandler.getNotes()
    const localLists = await this.indexedDBHandler.getLists()

    for (const note of localNotes) {
      const updatedNote = { ...note, uid: this.uid }
      await this.firebaseHandler.updateNote(updatedNote)
      await this.indexedDBHandler.updateNote(updatedNote)
    }

    for (const list of localLists) {
      const updatedList = { ...list, uid: this.uid }
      await this.firebaseHandler.updateList(updatedList)
      await this.indexedDBHandler.updateList(updatedList)
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

  async clear(): Promise<void> {
    await Promise.all([
      this.indexedDBHandler.clear(),
      this.firebaseHandler.clear(),
    ])
  }

  hasUid(): boolean {
    return !!this.uid
  }
}
