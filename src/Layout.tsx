import { Spinner, VStack, Text, Container, Tabs, Flex, Heading, Center } from '@chakra-ui/react'
import { useSessionContext } from './SessionProvider'
import { ColorModeButton } from './components/ui/color-mode'
import { Note, ToDoList } from './components'
import { SlList, SlNote } from 'react-icons/sl'

export function Layout() {
  const { sessionId } = useSessionContext()
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
        <Heading size="2xl">My Notes and ToDos</Heading>
        <ColorModeButton />
      </Flex>

      <Tabs.Root defaultValue="todos">
        <Tabs.List>
          <Tabs.Trigger value="todos">
            <SlList />
            To Do List
          </Tabs.Trigger>
          <Tabs.Trigger value="notes">
            <SlNote />
            Notes
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="todos">
          <ToDoList />
        </Tabs.Content>
        <Tabs.Content value="notes">
          <Note />
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  )
}
