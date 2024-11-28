import { Card, Container, Editable, Flex, IconButton } from '@chakra-ui/react'
import { Checkbox } from './ui/checkbox'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { SlBasket, SlClose, SlPlus, SlTrash } from "react-icons/sl"
import { ExtendedComponentProps, ListItem, ListProps } from '../types'
import { ShareButton } from './ShareButton'
import { useDebouncedCallback } from 'use-debounce'
import { Tag } from './ui/tag'

const sortByChecked = (a: ListItem, b: ListItem) => {
  if (a.checked && !b.checked) return 1
  if (!a.checked && b.checked) return -1
  return 0
}

export function List({ id, title = 'New List', items, onChange, onRemove, ...props }: ExtendedComponentProps<ListProps>) {
  const [name, setName] = useState(title)
  const [checkboxes, setCheckboxes] = useState<ListItem[]>(items)
  const isShared = !!props.allowedUsers?.length

  const addCheckbox = (pos?: number) => {
    if (pos !== undefined) {
      const newId = (checkboxes.length + 1).toString()
      setCheckboxes([
        ...checkboxes.slice(0, pos + 1),
        { id: newId, content: '', checked: false },
        ...checkboxes.slice(pos + 1),
      ])
      return
    }
    setCheckboxes([
      ...checkboxes,
      { id: (checkboxes.length + 1).toString(), content: '', checked: false },
    ])
  }

  const toggleCheckbox = (id: string) => {
    setCheckboxes(
      checkboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
      ).sort(sortByChecked)
    )
  }

  const updateCheckbox = (id: string, content: string) => {
    setCheckboxes(
      checkboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, content } : checkbox
      ).sort(sortByChecked)
    )
  }

  const removeItem = (id: string) => {
    setCheckboxes(checkboxes.filter((checkbox) => checkbox.id !== id))
  }

  const debounced = useDebouncedCallback((value) => onChange?.(value), 500)

  const handleSave = () => {
    debounced({ id, title: name, items: checkboxes, ...props })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter') {
      addCheckbox(index)
    }
  }

  useEffect(() => {
    handleSave()
  }, [checkboxes, name])

  useEffect(() => {
    if (JSON.stringify(items) !== JSON.stringify(checkboxes)) {
      setCheckboxes(items)
    }
  }, [items])

  return (
    <Container lg={{ maxHeight: 500 }} sm={{ maxHeight: 300 }}>
      <Card.Root lg={{ maxHeight: 500 }} sm={{ maxHeight: 300 }}>
        <Card.Header>
          <Flex gap="1rem" justify="space-between" marginEnd="1rem">
            <Flex gap="1rem" align="center">
              <SlBasket />
              <Editable.Root
                value={name}
                onValueChange={(e) => setName(e.value)}
                placeholder="Click to edit"
                maxLength={100}
              >
                <Editable.Preview />
                <Editable.Input />
              </Editable.Root>
            </Flex>
            <Flex align="center" gap="5px">
              {onRemove && (
                <IconButton
                  aria-label="Delete list"
                  colorPalette="red"
                  variant="plain"
                  size="sm"
                  onClick={() => onRemove(id)}
                >
                  <SlTrash />
                </IconButton>
              )}
              {isShared && (
                <Tag colorPalette="teal" variant="outline" size="sm">Shared</Tag>
              )}
            </Flex>
          </Flex>
          <ShareButton resourceId={id} type="list" />
        </Card.Header>
        <Card.Body overflow="auto">
          {checkboxes.map((checkbox, index) => (
            <Flex key={checkbox.id} justify="space-between">
              <Flex gap="5px">
                <Checkbox
                  checked={checkbox.checked}
                  variant="outline"
                  colorPalette="yellow"
                  onCheckedChange={() => toggleCheckbox(checkbox.id)}
                />
                <Editable.Root
                  value={checkbox.content}
                  onValueChange={(e) => updateCheckbox(checkbox.id, e.value)}
                  placeholder="Click to edit"
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
              </Flex>
              <IconButton
                aria-label="Remove list item"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(checkbox.id)}
              >
                <SlClose />
              </IconButton>
            </Flex>
          ))}
        </Card.Body>
        <Card.Footer>
          <Button colorPalette="yellow" variant="outline" onClick={() => addCheckbox()}>
            <SlPlus /> List Item
          </Button>
        </Card.Footer>
      </Card.Root>
    </Container>
  )
}
