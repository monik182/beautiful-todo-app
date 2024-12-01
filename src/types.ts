export interface NoteProps {
  id: string
  title: string
  content: string
  icon?: string
  date?: string
  uid?: string
  sessionId: string
  allowedUsers?: string[]
  order: number
}

export interface ListProps {
  id: string
  title: string
  items: ListItem[]
  icon?: string
  date?: string
  uid?: string
  sessionId: string
  allowedUsers?: string[]
  order: number
}

export interface ListItem {
  id: string
  content: string
  checked: boolean
}

export type PropsWithSessionId<T> = T & { sessionId: string }

export interface ComponentEventHandlers<T> {
  onChange?: (props: T) => void
  onRemove?: (id: string) => void
}

export type ExtendedComponentProps<T> = T & ComponentEventHandlers<T>
