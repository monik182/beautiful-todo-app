import { IconButton } from '@chakra-ui/react'
import { useAuth, useStorage } from '../providers'
import { SlLogout, SlSocialGoogle } from 'react-icons/sl'
import { Avatar, AvatarGroup } from './ui/avatar'
import { useState } from 'react'
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from './ui/popover'

export function AuthButton() {
  const { clear } = useStorage()
  const { signInWithGoogle, logout, user } = useAuth()
  const [open, setOpen] = useState(false)
  const handleLogout = async () => {
    setOpen(false)
    logout()
    await clear()
    window.location.reload()
  }

  if (!user) {
    return (
      <IconButton
        onClick={signInWithGoogle}
        variant="ghost"
        colorPalette="green"
        aria-label="Sign in with Google"
      >
        <SlSocialGoogle />
      </IconButton>
    )
  }

  return (
    <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)} size="sm">
      <PopoverTrigger asChild>
        <AvatarGroup>
          <Avatar size="sm" src={user.photoURL!} />
        </AvatarGroup>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <IconButton variant="plain" aria-label="Sign out" onClick={handleLogout}>
            <SlLogout /> Logout
          </IconButton>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}
