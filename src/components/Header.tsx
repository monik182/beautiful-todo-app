import { Flex, Heading, IconButton, Link, Separator } from '@chakra-ui/react';
import { ColorModeButton } from './ui/color-mode';
import { SlRefresh } from 'react-icons/sl';
import { useAuth, useStorage } from '../providers';
import { AuthButton } from './AuthButton';
import { notifySuccess } from '../utils';

export function Header() {
  const { user } = useAuth()
  const { sync, loading } = useStorage()

  const handleSync = async () => {
    await sync?.()
    notifySuccess('Synced Successfully')
  }

  return (
    <header>
      <Flex justify="space-between" align="center">
        <Flex gap="1rem" align="center">
          <Heading size="2xl">Lists & Notes</Heading>
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
            </ul>
          </nav>
        </Flex>
        <Flex gap="5px" align="center">
          <AuthButton />
          {!!user?.uid  && (
            <IconButton onClick={handleSync} variant="ghost" aria-label="Sync" disabled={loading}>
              <SlRefresh />
            </IconButton>
          )}
          <ColorModeButton />
        </Flex>
      </Flex>
      <Separator margin="1rem 0" />
    </header>
  )
}
