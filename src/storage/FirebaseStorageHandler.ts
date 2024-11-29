import { FirebaseApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, query, getDocs, Firestore, CollectionReference } from 'firebase/firestore'
import { StorageHandler } from './StorageHandler'
import { ListProps, NoteProps } from '../types'

export class FirebaseStorageHandler implements StorageHandler {
  sessionId: string
  private notesCollection: CollectionReference | null = null
  private listsCollection: CollectionReference | null = null
  private db: Firestore | null = null

  constructor(sessionId: string, firebaseApp: FirebaseApp | null) {
    this.sessionId = sessionId
    if (firebaseApp) {
      this.db = getFirestore(firebaseApp)
      this.notesCollection = collection(this.db, 'notes')
      this.listsCollection = collection(this.db, 'lists')
    }
  }

  async initialize(): Promise<void> {
    console.log(`FirebaseStorageHandler initialized for session: ${this.sessionId}`)
  }

  // Notes
  async createNote(note: NoteProps): Promise<void> {
    if (!this.notesCollection) {
      console.error('Notes collection not initialized')
      return
    }
    const noteRef = doc(this.notesCollection, note.id)
    await setDoc(noteRef, note)
  }

  async getNote(id: string, isPublic: boolean = false): Promise<NoteProps | undefined> {
    if (!this.notesCollection) {
      console.error('Notes collection not initialized')
      return
    }
    const noteRef = doc(this.notesCollection, id)
    const docSnap = await getDoc(noteRef)

    if (docSnap.exists()) {
      const note = docSnap.data() as NoteProps
      if (isPublic) {
        return note
      }
      const canAccessNote = note.sessionId === this.sessionId || (note.allowedUsers && note.allowedUsers.includes(this.sessionId))
      return canAccessNote ? note : undefined
    }
    return undefined
  }

  async getNotes(): Promise<NoteProps[]> {
    if (!this.notesCollection) {
      console.error('Notes collection not initialized')
      return []
    }
    const notesQuery = query(this.notesCollection)
    const querySnapshot = await getDocs(notesQuery)

    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteProps[]
    return result?.filter((note) => note.sessionId === this.sessionId || (note.allowedUsers && note.allowedUsers.includes(this.sessionId)))
  }

  async updateNote(note: Partial<NoteProps> & { id: string }): Promise<void> {
    if (!this.notesCollection) {
      console.error('Notes collection not initialized')
      return
    }
    const noteRef = doc(this.notesCollection, note.id)
    await setDoc(noteRef, note, { merge: true })
  }

  async deleteNote(id: string): Promise<void> {
    if (!this.notesCollection) {
      console.error('Notes collection not initialized')
      return
    }
    const noteRef = doc(this.notesCollection, id)
    await deleteDoc(noteRef)
  }

  // Lists
  async createList(list: ListProps): Promise<void> {
    if (!this.listsCollection) {
      console.error('Lists collection not initialized')
      return
    }
    const listRef = doc(this.listsCollection, list.id)
    await setDoc(listRef, list)
  }

  async getList(id: string, isPublic: boolean = false): Promise<ListProps | undefined> {
    if (!this.listsCollection) {
      console.error('Lists collection not initialized')
      return
    }
    const listRef = doc(this.listsCollection, id)
    const docSnap = await getDoc(listRef)

    if (docSnap.exists()) {
      const list = docSnap.data() as ListProps
      if (isPublic) {
        return list
      }
      const canAccessList = list.sessionId === this.sessionId || (list.allowedUsers && list.allowedUsers.includes(this.sessionId))
      return canAccessList ? list : undefined
    }
    return undefined
  }

  async getLists(): Promise<ListProps[]> {
    if (!this.listsCollection) {
      console.error('Lists collection not initialized')
      return []
    }
    const listsQuery = query(this.listsCollection)
    const querySnapshot = await getDocs(listsQuery)

    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ListProps[]
    return result?.filter((list) => list.sessionId === this.sessionId || (list.allowedUsers && list.allowedUsers.includes(this.sessionId)))
  }

  async updateList(list: Partial<ListProps> & { id: string }): Promise<void> {
    if (!this.listsCollection) {
      console.error('Lists collection not initialized')
      return
    }
    const listRef = doc(this.listsCollection, list.id)
    await setDoc(listRef, list, { merge: true })
  }

  async deleteList(id: string): Promise<void> {
    if (!this.listsCollection) {
      console.error('Lists collection not initialized')
      return
    }
    const listRef = doc(this.listsCollection, id)
    await deleteDoc(listRef)
  }

}
