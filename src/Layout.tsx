import { Spinner, VStack, Text, Container, Flex, Heading, Center } from '@chakra-ui/react'
import { useSessionContext } from './SessionProvider'
import { ColorModeButton } from './components/ui/color-mode'

export function Layout({ children }: { children: React.ReactNode }) {
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
        <Heading size="2xl">Notes and Lists</Heading>
        <ColorModeButton />
      </Flex>
      {children}
    </Container>
  )
}
