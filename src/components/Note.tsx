import { Card, Editable, Flex, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { SlHeart } from 'react-icons/sl'
import { NoteProps } from '../types'
import { ShareButton } from '.'
import { useStorage } from '../storage'

export function Note({ id, title = 'New Note', content }: NoteProps) {
  const storage = useStorage()
  const [name, setName] = useState(title)
  const [text, setContent] = useState(content)

  const handleChange = async (value: Partial<NoteProps>) => {
    const { title, content } = value
    if (title) setName(title)
    if (content) setContent(content)
    await storage.updateNote({
      id,
      title: name,
      content: text,
      ...value
    })
  }

  return (
    <Card.Root>
      <Card.Header position="relative">
        <Flex gap="1rem" align="center">
          <SlHeart />
          <Editable.Root
            value={name}
            onValueChange={(e) => handleChange({title: e.value})}
            placeholder="Click to edit"
            maxLength={100}
          >
            <Editable.Preview />
            <Editable.Input />
          </Editable.Root>
        </Flex>
        <ShareButton resourceId={id} type="note" />
      </Card.Header>
      <Card.Body>
        <Textarea 
          value={text} 
          maxLength={1000}
          variant="flushed" 
          placeholder="Write your thoughts ❤️..." 
          onChange={(e) => handleChange({content: e.target.value}) } 
        />
      </Card.Body>
    </Card.Root>
  )
}