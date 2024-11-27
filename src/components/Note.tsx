import { Card, Editable, Flex, Float, IconButton, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { SlHeart, SlShareAlt } from 'react-icons/sl'
import { NoteProps } from '../types'

export function Note({ id, title = 'New Note', content}: NoteProps) {
  const [name, setName] = useState(title)
  const [text, setContent] = useState(content)
  return (
    <Card.Root>
      <Card.Header position="relative">
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
        <Float offset="5" >
          <IconButton
            aria-label="Call support"
            variant="ghost"
          >
            <SlShareAlt />
          </IconButton>
        </Float>
      </Card.Header>
      <Card.Body>
        <Textarea variant="flushed" placeholder="Write your thoughts ❤️..." value={text} onChange={(e) => setContent(e.target.value) } />
      </Card.Body>
    </Card.Root>
  )
}