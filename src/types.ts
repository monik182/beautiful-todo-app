export interface NoteProps {
  id: string
  title: string
  content: string
}

export interface ListProps {
  id: string
  title: string
  items: ListItem[]
}

export interface ListItem {
  id: string
  content: string
  checked: boolean
}

export type PropsWithSessionId<T> = T & { sessionId: string }

