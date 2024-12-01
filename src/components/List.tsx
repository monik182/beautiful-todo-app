import { Card, Container, Editable, Flex, IconButton } from '@chakra-ui/react'
import { Checkbox } from './ui/checkbox'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ExtendedComponentProps, ListItem, ListProps } from '../types'
import { ShareButton } from './ShareButton'
import { useDebouncedCallback } from 'use-debounce'
import { Tag } from './ui/tag'
import { IconPopover } from './IconPopover'
import { SlClose, SlPlus, SlTrash } from 'react-icons/sl'
import { sortByChecked } from '../utils'

export function List({ id, title = 'New List', items, onChange, onRemove, ...props }: ExtendedComponentProps<ListProps>) {
  const [name, setName] = useState(title)
  const [checkboxes, setCheckboxes] = useState<ListItem[]>(items)
  const isShared = !!props.allowedUsers?.length
  const debounced = useDebouncedCallback((value) => onChange?.(value), 500)

  const handleChange = async (value: Partial<ListProps>) => {
    const updatedList: Partial<ListProps> = {
      id,
      title: name,
      items: checkboxes,
      ...props,
    }
    const { title, icon, items } = value

    if (title != null && title !== name) {
      setName(title)
      updatedList.title = title
    }

    if (items != null && JSON.stringify(items) !== JSON.stringify(checkboxes)) {
      updatedList.items = items
    }

    if (icon != null && icon !== props.icon) {
      updatedList.icon = icon
    }

    debounced(updatedList as ListProps)
  }

  const addCheckbox = (pos?: number) => {
    let updatedCheckboxes
    const newId = (checkboxes.length + 1).toString()

    if (pos !== undefined) {
      updatedCheckboxes = [
        ...checkboxes.slice(0, pos + 1),
        { id: newId, content: '', checked: false },
        ...checkboxes.slice(pos + 1),
      ]
    } else {
      updatedCheckboxes = [
        ...checkboxes,
        { id: newId, content: '', checked: false },
      ]
    }

    setCheckboxes(updatedCheckboxes)
    handleChange({ items: updatedCheckboxes })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter') {
      addCheckbox(index)
    }
  }

  const toggleCheckbox = (id: string) => {
    const updatedCheckboxes = checkboxes.map((checkbox) =>
      checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
    ).sort(sortByChecked)
    setCheckboxes(updatedCheckboxes)
    handleChange({ items: updatedCheckboxes })
  }

  const updateCheckboxContent = (id: string, content: string) => {
    const updatedCheckboxes = checkboxes.map((checkbox) =>
      checkbox.id === id ? { ...checkbox, content } : checkbox
    ).sort(sortByChecked)
    setCheckboxes(updatedCheckboxes)
    handleChange({ items: updatedCheckboxes })
  }

  const removeItem = (id: string) => {
    let updatedCheckboxes = checkboxes.filter((checkbox) => checkbox.id !== id)
    setCheckboxes(updatedCheckboxes)
    handleChange({ items: updatedCheckboxes })
  }

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
            <Flex gap="1rem" align="center" flex="1">
              <IconPopover icon={props.icon} onChange={handleChange} />
              <Editable.Root
                value={name}
                onValueChange={(e) => handleChange({ title: e.value })}
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
                  onValueChange={(e) => updateCheckboxContent(checkbox.id, e.value)}
                  placeholder="Click to edit"
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  defaultEdit
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
