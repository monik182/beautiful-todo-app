import { Spinner, VStack, Text, Container, Tabs, Flex, Heading, Center, SimpleGrid } from '@chakra-ui/react'
import { useSessionContext } from './SessionProvider'
import { ColorModeButton } from './components/ui/color-mode'
import { Note, List } from './components'
import { SlList, SlNote, SlPlus } from 'react-icons/sl'
import { useState } from 'react'
import { ListProps, NoteProps } from './types'
import { Button } from './components/ui/button'

export function Layout() {
  const { sessionId } = useSessionContext()
  const [lists, setLists] = useState<ListProps[]>([])
  const [notes, setNotes] = useState<NoteProps[]>([])

  const addNewList = () => {
    setLists([...lists, { id: (lists.length + 1).toString(), title: 'New List', items: [] }])
  }

  const addNewNote = () => {
    setNotes([...notes, { id: (notes.length + 1).toString(), title: 'New Note', content: '' }])
  }

  if (!sessionId) {
    return (
      <Center height="100vh">
        <Flex align="center">
          <VStack>
            <Spinner />
            <Text>Loading...</Text>
          </VStack>
        </Flex>
      </Center>
    )
  }

  return (
    <Container margin="1rem 2rem">
      <Flex justify="space-between">
        <Heading size="2xl">Notes and Lists</Heading>
        <ColorModeButton />
      </Flex>

      <Tabs.Root defaultValue="list">
        <Tabs.List>
          <Tabs.Trigger value="list">
            <SlList />
            List
          </Tabs.Trigger>
          <Tabs.Trigger value="notes">
            <SlNote />
            Notes
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="list">
          <Flex gap="2rem" direction="column">
            <SimpleGrid columns={[2, null, 3]} gap="20px" minChildWidth="sm">
              {lists.map((props) => <List {...props} />)}
            </SimpleGrid>
            <Button colorPalette="yellow" variant="outline" onClick={addNewList}>
              <SlPlus /> New List
            </Button>
          </Flex>
        </Tabs.Content>
        <Tabs.Content value="notes">
          <Flex gap="2rem" direction="column">
            <SimpleGrid columns={[2, null, 3]} gap="20px" minChildWidth="sm">
              {notes.map((props) => <Note {...props} />)}
            </SimpleGrid>
            <Button colorPalette="yellow" variant="outline" onClick={addNewNote}>
              <SlPlus /> New Note
            </Button>
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  )
}
