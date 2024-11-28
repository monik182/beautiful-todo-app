import { Container } from '@chakra-ui/react'
import { Header } from './components/Header'
import { Toaster } from './components/ui/toaster'

export function Layout({ children }: { children: React.ReactNode }) {

  return (
    <Container margin="1rem 2rem">
      <Header />
      {children}
      <Toaster />
    </Container>
  )
}
