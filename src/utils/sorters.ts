import { ListItem } from '../types'

export function sortByORder(a: { order: number }, b: { order: number }) {
  return a.order - b.order
}

export const sortByChecked = (a: ListItem, b: ListItem) => {
  if (a.checked && !b.checked) return 1
  if (!a.checked && b.checked) return -1
  return 0
}