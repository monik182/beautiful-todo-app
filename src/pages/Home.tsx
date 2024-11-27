import { Flex, SimpleGrid, Tabs } from '@chakra-ui/react';
import { Button } from '../components/ui/button';
import { SlList, SlNote, SlPlus } from 'react-icons/sl';
import { useSessionContext } from '../SessionProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQueryParams } from '../hooks/useQueryParams';
import { ListProps, NoteProps } from '../types';
import { List, Note } from '../components';

export function Home() {
  const { sessionId } = useSessionContext()
  const navigate = useNavigate()
  const params = useQueryParams()
  const currentTab = params.get('tab') || 'list'
  const [tab, setTab] = useState<string | null>("list")
  const [lists, setLists] = useState<ListProps[]>([])
  const [notes, setNotes] = useState<NoteProps[]>([])

  const addNewList = () => {
    setLists([...lists, { id: (lists.length + 1).toString(), title: 'New List', items: [] }])
  }

  const addNewNote = () => {
    setNotes([...notes, { id: (notes.length + 1).toString(), title: 'New Note', content: '' }])
  }

  const handleTabChange = (tab: string) => {
    setTab(tab)
    navigate(`?tab=${tab}`, { replace: true })
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
            {lists.map((props) => <List sessionId={sessionId!} {...props} />)}
          </SimpleGrid>
          <Button colorPalette="yellow" variant="outline" onClick={addNewList}>
            <SlPlus /> New List
          </Button>
        </Flex>
      </Tabs.Content>
      <Tabs.Content value="notes">
        <Flex gap="2rem" direction="column">
          <SimpleGrid columns={[2, null, 3]} gap="20px" minChildWidth="sm">
            {notes.map((props) => <Note sessionId={sessionId!} {...props} />)}
          </SimpleGrid>
          <Button colorPalette="yellow" variant="outline" onClick={addNewNote}>
            <SlPlus /> New Note
          </Button>
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  )
}