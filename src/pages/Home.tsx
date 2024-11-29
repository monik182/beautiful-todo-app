import { Flex, Input, SimpleGrid, Tabs } from '@chakra-ui/react'
import { Button } from '../components/ui/button'
import { SlList, SlNote, SlPlus } from 'react-icons/sl'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQueryParams } from '../hooks/useQueryParams'
import { List, Note } from '../components'
import { generateResourceId } from '../utils'
import { useSessionContext, useStorage } from '../providers'

export function Home() {
  const navigate = useNavigate()
  const params = useQueryParams()
  const { sessionId } = useSessionContext()
  const { notes, lists, createNote, createList, updateNote, updateList, deleteList, deleteNote } = useStorage()
  const currentTab = params.get('tab') || 'list'
  const [tab, setTab] = useState<string | null>('list')
  const [filteredLists, setFilteredLists] = useState(lists)
  const [filteredNotes, setFilteredNotes] = useState(notes)

  const isOwner = (resourceSessionId: string) => {
    return sessionId === resourceSessionId
  }

  const addNewList = () => {
    createList({ id: generateResourceId(), sessionId: sessionId!, title: 'New List', icon: 'SlBasket', items: [], date: new Date().toISOString() })
  }

  const addNewNote = () => {
    createNote({ id: generateResourceId(), sessionId: sessionId!, title: 'New Note', content: '', date: new Date().toISOString() })
  }

  const handleTabChange = (tab: string) => {
    setTab(tab)
    navigate(`?tab=${tab}`, { replace: true })
  }

  const handleListSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value) {
      return setFilteredLists(lists)
    }
    const filteredLists = lists.filter((list) => list.title.toLowerCase().includes(value.toLowerCase()))
    setFilteredLists(filteredLists)
  }

  const handleNoteSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value) {
      return setFilteredNotes(notes)
    }
    const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(value.toLowerCase()))
    setFilteredNotes(filteredNotes)
  }

  useEffect(() => {
    navigate(`?tab=${currentTab}`, { replace: true })
    setTab(currentTab)
  }, [currentTab, navigate])

  useEffect(() => {
    setFilteredLists(lists)
  }, [lists])

  useEffect(() => {
    setFilteredNotes(notes)
  }, [notes])

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
        <Input 
          placeholder="Search list"
          onChange={handleListSearch}
          marginBottom="1rem"
          variant="subtle"
        />
        <Flex gap="2rem" direction="column">
          <SimpleGrid columns={[2, null, 3]} gap="20px" minChildWidth="sm">
            {filteredLists.map((props) => <List key={props.id} {...props} onChange={updateList} onRemove={isOwner(props.sessionId) ? deleteList : undefined} />)}
            <Button colorPalette="yellow" variant="outline" onClick={addNewList}>
              <SlPlus /> New List
            </Button>
          </SimpleGrid>
        </Flex>
      </Tabs.Content>
      <Tabs.Content value="notes">
        <Input
          placeholder="Search note"
          onChange={handleNoteSearch}
          marginBottom="1rem"
          variant="subtle"
        />
        <Flex gap="2rem" direction="column">
          <SimpleGrid columns={[2, null, 3]} gap="20px" minChildWidth="sm">
            {filteredNotes.map((props) => <Note key={props.id} {...props} onChange={updateNote} onRemove={isOwner(props.sessionId) ? deleteNote : undefined} />)}
            <Button colorPalette="yellow" variant="outline" onClick={addNewNote}>
              <SlPlus /> New Note
            </Button>
          </SimpleGrid>
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  )
}
