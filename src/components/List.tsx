import { Card, Container, Editable, Flex } from '@chakra-ui/react'
import { Checkbox } from './ui/checkbox'
import { useState } from 'react'
import { Button } from './ui/button'
import { SlBasket, SlPlus } from "react-icons/sl"

interface ListItem {
  id: string
  content: string
  checked: boolean
}

export function List() {
  const [name, setName] = useState('New List')
  const [checkboxes, setCheckboxes] = useState<ListItem[]>([])

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
            >
              <Editable.Preview />
              <Editable.Input />
            </Editable.Root>
          </Flex>
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
