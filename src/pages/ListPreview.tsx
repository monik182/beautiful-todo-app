import { useEffect, useState } from 'react'
import { List } from '../components'
import { useQueryParams } from '../hooks/useQueryParams'
import { ListProps } from '../types'
import { useStorageManager } from '../hooks/useStorageManager'

export function ListPreview() {
  const { getList, updateList } = useStorageManager()
  const params = useQueryParams()
  const id = params.get('id')
  const isPublic = !!params.get('public')
  const canEdit = !!params.get('edit')
  const [list, setList] = useState<ListProps>()
  
  useEffect(() => {
    async function getData(id: string) {
      const list = await getList(id, isPublic)
      console.log('List:', list)
      setList(list)
    }

    if (id) {
      getData(id)
    }
  }, [id])

  return (
    <div>
      {list && <List {...list} onChange={canEdit ? updateList : undefined} />}
    </div>
  )
}
