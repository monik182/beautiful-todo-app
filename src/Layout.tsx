import { Container, Flex, Heading } from '@chakra-ui/react'
import { ColorModeButton } from './components/ui/color-mode'

export function Layout({ children }: { children: React.ReactNode }) {

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
