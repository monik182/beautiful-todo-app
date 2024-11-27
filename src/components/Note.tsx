import { Card, Editable, Flex, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { SlHeart } from 'react-icons/sl'
import { NoteProps, PropsWithSessionId } from '../types'
import { ShareButton } from '.'

export function Note({ sessionId, id, title = 'New Note', content }: PropsWithSessionId<NoteProps>) {
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
        <ShareButton sessionId={sessionId} resourceId={id} type="note" />
      </Card.Header>
      <Card.Body>
        <Textarea variant="flushed" placeholder="Write your thoughts ❤️..." value={text} onChange={(e) => setContent(e.target.value) } />
      </Card.Body>
    </Card.Root>
  )
}