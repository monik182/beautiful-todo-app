import { Card, Editable, Flex, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { SlHeart } from 'react-icons/sl'
import { ExtendedComponentProps, NoteProps } from '../types'
import { ShareButton } from '.'
import { useDebouncedCallback } from 'use-debounce'
import { Tag } from './ui/tag'

export function Note({ id, title = 'New Note', content, onChange, ...props }: ExtendedComponentProps<NoteProps>) {
  const [name, setName] = useState(title)
  const [text, setContent] = useState(content)
  const isShared = !!props.allowedUsers?.length

  const handleChange = async (value: Partial<NoteProps>) => {
    const updatedNote: Partial<NoteProps> = {
      id,
      title: name,
      content: text,
      ...props,
    }
    const { title, content } = value

    if (title != null && title !== name) {
      setName(title)
      updatedNote.title = title
    }
    if (content != null && content !== text) {
      setContent(content)
      updatedNote.content = content
    }

    debounced(updatedNote as NoteProps)
  }

  const debounced = useDebouncedCallback((value) => onChange?.(value), 500)

  return (
    <Card.Root lg={{ maxHeight: 500 }} sm={{ maxHeight: 300 }}>
      <Card.Header position="relative">
        <Flex gap="1rem" justify="space-between" marginEnd="1rem">
          <Flex gap="1rem" align="center">
            <SlHeart />
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
          {isShared && (
            <Tag colorPalette="teal" variant="outline" size="sm">Shared</Tag>
          )}
        </Flex>
        <ShareButton resourceId={id} type="note" />
      </Card.Header>
      <Card.Body overflow="auto">
        <Textarea
          value={text}
          maxLength={5000}
          variant="flushed"
          placeholder="Write your thoughts ❤️..."
          onChange={(e) => handleChange({ content: e.target.value })}
        />
      </Card.Body>
    </Card.Root>
  )
}
