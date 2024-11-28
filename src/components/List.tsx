import { Card, Container, Editable, Flex } from '@chakra-ui/react'
import { Checkbox } from './ui/checkbox'
import { useState } from 'react'
import { Button } from './ui/button'
import { SlBasket, SlPlus } from "react-icons/sl"
import { ListItem, ListProps } from '../types'
import { ShareButton } from './ShareButton'


export function List({ id, title = 'New List', items }: ListProps) {
  const [name, setName] = useState(title)
  const [checkboxes, setCheckboxes] = useState<ListItem[]>(items)

  const addCheckbox = () => {
    setCheckboxes([
      ...checkboxes,
      { id: (checkboxes.length + 1).toString(), content: '', checked: false },
    ])
  }

  const toggleCheckbox = (id: string) => {
    setCheckboxes(
      checkboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
      )
    )
  }

  const updateCheckbox = (id: string, content: string) => {
    setCheckboxes(
      checkboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, content } : checkbox
      )
    )
  }

  return (
    <Container>
      <Card.Root>
        <Card.Header>
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
          <ShareButton resourceId={id} type="list" />
        </Card.Header>
        <Card.Body>
          {checkboxes.map((checkbox) => (
            <Flex key={checkbox.id} gap="5px">
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
              >
                <Editable.Preview />
                <Editable.Input />
              </Editable.Root>
            </Flex>
          ))}
        </Card.Body>
        <Card.Footer>
          <Button colorPalette="yellow" variant="outline" onClick={addCheckbox}>
            <SlPlus /> List Item
          </Button>
        </Card.Footer>
      </Card.Root>
    </Container>
  )
}
