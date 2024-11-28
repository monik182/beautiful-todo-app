import React from 'react'
import './App.css'
import { Provider } from './components/ui/provider'
import { SessionProvider, useSessionContext } from './SessionProvider'
import { Layout } from './Layout'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Home, NotePreview } from './pages'
import { Center, Flex, Spinner, VStack, Text } from '@chakra-ui/react'
import { StorageProvider } from './storage'
import { ListPreview } from './pages/ListPreview'

function AppContent() {
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
    <StorageProvider sessionId={sessionId} useFirebase={false}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/note" element={<NotePreview />} />
          <Route path="/list" element={<ListPreview />} />
        </Routes>
      </Layout>
    </StorageProvider>
  )
}

function App() {
  return (
    <Router>
      <SessionProvider>
        <Provider>
          <AppContent />
        </Provider>
      </SessionProvider>
    </Router>
  )
}

export default App
