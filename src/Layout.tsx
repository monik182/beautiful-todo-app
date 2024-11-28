import { Container } from '@chakra-ui/react'
import { Header } from './components/Header'

export function Layout({ children }: { children: React.ReactNode }) {

  return (
    <Container margin="1rem 2rem">
      <Header />
      {children}
    </Container>
  )
}
