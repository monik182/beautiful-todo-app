import { Flex, Heading, IconButton, Link, Separator } from '@chakra-ui/react';
import { ColorModeButton } from './ui/color-mode';
import { SlRefresh } from 'react-icons/sl';
import { useStorageManager } from '../hooks/useStorageManager';

export function Header() {
  const { sync, loading } = useStorageManager()

  return (
    <header>
      <Flex justify="space-between" align="center">
        <Flex gap="1rem" align="center">
          <Heading size="2xl">Lists & Notes</Heading>
          <nav>
            <ul>
              <li>
                <Link href="/">Home Chakra</Link>
              </li>
            </ul>
          </nav>
        </Flex>
        <div>
          <IconButton onClick={sync} variant="ghost" aria-label="Sync" disabled={loading}>
            <SlRefresh />
          </IconButton>
        <ColorModeButton />
        </div>
      </Flex>
      <Separator margin="1rem 0" />
    </header>
  )
}
