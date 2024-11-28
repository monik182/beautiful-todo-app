import { Flex, SimpleGrid, Tabs } from '@chakra-ui/react';
import { Button } from '../components/ui/button';
import { SlList, SlNote, SlPlus } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQueryParams } from '../hooks/useQueryParams';
import { List, Note } from '../components';
import { generateResourceId } from '../storage/utils/utils';
import { useSessionContext } from '../SessionProvider';
import { useStorage } from '../storage';
export function Home() {
  const navigate = useNavigate()
  const params = useQueryParams()
  const { sessionId } = useSessionContext()
  const { notes, lists, createNote, createList, updateNote, updateList, deleteList, deleteNote } = useStorage()
  const currentTab = params.get('tab') || 'list'
  const [tab, setTab] = useState<string | null>('list')

  const addNewList = () => {
    createList({ id: generateResourceId(), sessionId: sessionId!, title: 'New List', items: [], date: new Date().toISOString() })
  }

  const addNewNote = () => {
    createNote({ id: generateResourceId(), sessionId: sessionId!, title: 'New Note', content: '', date: new Date().toISOString() })
  }

  const handleTabChange = (tab: string) => {
    setTab(tab)
    navigate(`?tab=${tab}`, { replace: true })
  }

  const isOwner = (resourceSessionId: string) => {
    return sessionId === resourceSessionId
  }

  useEffect(() => {
    navigate(`?tab=${currentTab}`, { replace: true })
    setTab(currentTab)
  }, [currentTab, navigate])

  return (
    <Tabs.Root defaultValue="list" value={tab} onValueChange={(e) => handleTabChange(e.value)}>
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
            {lists.map((props) => <List key={props.id} {...props} onChange={updateList} onRemove={isOwner(props.sessionId) ? deleteList : undefined} />)}
          </SimpleGrid>
          <Button colorPalette="yellow" variant="outline" onClick={addNewList}>
            <SlPlus /> New List
          </Button>
        </Flex>
      </Tabs.Content>
      <Tabs.Content value="notes">
        <Flex gap="2rem" direction="column">
          <SimpleGrid columns={[2, null, 3]} gap="20px" minChildWidth="sm">
            {notes.map((props) => <Note key={props.id} {...props} onChange={updateNote} onRemove={isOwner(props.sessionId) ? deleteNote : undefined} />)}
          </SimpleGrid>
          <Button colorPalette="yellow" variant="outline" onClick={addNewNote}>
            <SlPlus /> New Note
          </Button>
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  )
}
