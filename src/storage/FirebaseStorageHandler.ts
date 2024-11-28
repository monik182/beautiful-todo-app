import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, query, getDocs } from 'firebase/firestore'
import { StorageHandler } from './StorageHandler'
import { ListProps, NoteProps } from '../types'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export class FirebaseStorageHandler implements StorageHandler {
  sessionId: string
  private notesCollection
  private listsCollection

  constructor(sessionId: string) {
    this.sessionId = sessionId
    this.notesCollection = collection(db, 'notes')
    this.listsCollection = collection(db, 'lists')
  }

  async initialize(): Promise<void> {
    console.log(`FirebaseStorageHandler initialized for session: ${this.sessionId}`)
  }

  // Notes
  async createNote(note: NoteProps): Promise<void> {
    const noteRef = doc(this.notesCollection, note.id)
    await setDoc(noteRef, note)
  }

  async getNote(id: string, isPublic: boolean = false): Promise<NoteProps | undefined> {
    const noteRef = doc(this.notesCollection, id)
    const docSnap = await getDoc(noteRef)

    if (docSnap.exists()) {
      const note = docSnap.data() as NoteProps
      if (isPublic) {
        return note
      }
      return note.sessionId === this.sessionId ? note : undefined
    }
    return undefined
  }

  async getNotes(): Promise<NoteProps[]> {
    const notesQuery = query(this.notesCollection)
    const querySnapshot = await getDocs(notesQuery)

    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteProps[]
    return result?.filter((note) => note.sessionId === this.sessionId)
  }

  async updateNote(note: Partial<NoteProps> & { id: string }): Promise<void> {
    const noteRef = doc(this.notesCollection, note.id)
    await setDoc(noteRef, note, { merge: true })
  }

  async deleteNote(id: string): Promise<void> {
    const noteRef = doc(this.notesCollection, id)
    await deleteDoc(noteRef)
  }

  // Lists
  async createList(list: ListProps): Promise<void> {
    const listRef = doc(this.listsCollection, list.id)
    await setDoc(listRef, list)
  }

  async getList(id: string, isPublic: boolean = false): Promise<ListProps | undefined> {
    const listRef = doc(this.listsCollection, id)
    const docSnap = await getDoc(listRef)

    if (docSnap.exists()) {
      const list = docSnap.data() as ListProps
      if (isPublic) {
        return list
      }
      return list.sessionId === this.sessionId ? list : undefined
    }
    return undefined
  }

  async getLists(): Promise<ListProps[]> {
    const listsQuery = query(this.listsCollection)
    const querySnapshot = await getDocs(listsQuery)

    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ListProps[]
    return result?.filter((list) => list.sessionId === this.sessionId)
  }

  async updateList(list: Partial<ListProps> & { id: string }): Promise<void> {
    const listRef = doc(this.listsCollection, list.id)
    await setDoc(listRef, list, { merge: true })
  }

  async deleteList(id: string): Promise<void> {
    const listRef = doc(this.listsCollection, id)
    await deleteDoc(listRef)
  }

}
