import { useEffect, useState } from 'react'
import { List } from '../components'
import { useQueryParams } from '../hooks/useQueryParams'
import { ListProps } from '../types'
import { useStorage, useSessionContext, useAuth } from '../providers'
import { SlList } from 'react-icons/sl'
import { EmptyState } from '../components/ui/empty-state'
import { Button, Flex, Link } from '@chakra-ui/react'
import { Alert } from '../components/ui/alert'
import { notifySuccess } from '../utils'

export function ListPreview() {
  const params = useQueryParams()
  const { user } = useAuth()
  const { sessionId } = useSessionContext()
  const { getList, updateList } = useStorage()
  const id = params.get('id')
  const isPublic = !!params.get('public')
  const canEdit = !!params.get('edit')
  const [list, setList] = useState<ListProps>()
  const isOwner = list?.uid === user?.uid || list?.sessionId === sessionId
  const sharedWithUser = list?.allowedUsers?.includes(user?.uid || sessionId || '')
  const showAddButton = !isOwner && !sharedWithUser

  const add = () => {
    if (!list || !sessionId || list.sessionId === sessionId) return
    const allowedUsers = list?.allowedUsers || []
    try {
      const updatedList = { ...list, allowedUsers: [...allowedUsers, (user?.uid || sessionId)] }
      updateList(updatedList)
      setList(updatedList)
      notifySuccess('List added to your lists')
    } catch (error) {
      console.error('Error adding list:', error)
      notifySuccess('Error adding list')
    }
  }

  useEffect(() => {
    async function getData(id: string) {
      const list = await getList(id, isPublic)
      setList(list)
    }

    if (id) {
      getData(id)
    }
  }, [id])

  if (!list) {
    return (
      <EmptyState
        icon={<SlList />}
        title="List not found"
        description="The list you are looking for does not exist. You might be logged out or the list is private."
      >
        <Flex gap="5px">
          <span>Create a</span> <Link href="/">new list</Link>
        </Flex>
      </EmptyState>
    )
  }

  return (
    <div>
      <List {...list} onChange={canEdit ? updateList : undefined} />
      {showAddButton && (
        <Flex justify="center" margin="1rem" width="100%">
          <Button variant="outline" colorPalette="orange" size="xl" onClick={add}>Add to my lists</Button>
        </Flex>
      )}
      {sharedWithUser && (
        <Alert status="success" title="This list is already saved in your lists" marginTop="1rem" />
      )}
    </div>
  )
}
