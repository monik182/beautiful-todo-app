import React from 'react'
import './App.css'
import { Provider } from './components/ui/provider'
import { AuthProvider, SessionProvider, useSessionContext, FirebaseAppProvider, StorageProvider, useAuth } from './providers'
import { Layout } from './Layout'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Home, NotePreview } from './pages'
import { Center, Flex, Spinner, VStack, Text } from '@chakra-ui/react'
import { ListPreview } from './pages/ListPreview'

function AppContent() {
  const { sessionId } = useSessionContext()
  const { user } = useAuth()
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
    <StorageProvider sessionId={sessionId} uid={user?.uid}>
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
      <FirebaseAppProvider>
        <AuthProvider>
          <SessionProvider>
            <Provider>
              <AppContent />
            </Provider>
          </SessionProvider>
        </AuthProvider>
      </FirebaseAppProvider>
    </Router>
  )
}

export default App
