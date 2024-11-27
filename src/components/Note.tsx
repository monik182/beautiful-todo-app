import { Card, Editable, Flex, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { SlHeart } from 'react-icons/sl'

export function Note() {
  const [name, setName] = useState('New Note')
  return (
    <Card.Root>
      <Card.Header>
        <Flex gap="1rem" align="center">
          <SlHeart />
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
        <Textarea variant="flushed" placeholder="Write your thoughts ❤️..." />
      </Card.Body>
    </Card.Root>
  )
}