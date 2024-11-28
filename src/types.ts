export interface NoteProps {
  id: string
  title: string
  content: string
  icon?: string
  date?: string
}

export interface ListProps {
  id: string
  title: string
  items: ListItem[]
  icon?: string
  date?: string

}

export interface ListItem {
  id: string
  content: string
  checked: boolean
}

export type PropsWithSessionId<T> = T & { sessionId: string }

