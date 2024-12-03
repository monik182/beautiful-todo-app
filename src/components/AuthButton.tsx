import { Button, IconButton, Separator } from '@chakra-ui/react'
import { useAuth, useStorage } from '../providers'
import { SlLogout, SlPeople, SlSocialGoogle } from 'react-icons/sl'
import { Avatar, AvatarGroup } from './ui/avatar'
import { useState } from 'react'
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from './ui/popover'

export function AuthButton() {
  const { clear } = useStorage()
  const { signInWithGoogle, signInAnonymous, logout, user } = useAuth()
  const [open, setOpen] = useState(false)
  const handleLogout = async () => {
    setOpen(false)
    logout()
    await clear()
    window.location.reload()
  }

  const handleLogin = async () => {
    setOpen(false)
    await signInAnonymous()
    window.location.reload()
  }

  const handleGoogleLogin = async () => {
    setOpen(false)
    await signInWithGoogle()
    window.location.reload()
  }

  if (!user) {
    return (
      <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)} size="sm">
        <PopoverTrigger asChild>
          <Button variant="ghost" colorPalette="teal">Log In</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <IconButton
              onClick={handleLogin}
              variant="ghost"
              colorPalette="blue"
              aria-label="Sign in anonymously"
            >
              <SlPeople /> Continue as guest
            </IconButton>
            <Separator />
            <IconButton
              onClick={handleGoogleLogin}
              variant="ghost"
              colorPalette="green"
              aria-label="Sign in with Google"
            >
              <SlSocialGoogle /> Continue with Google
            </IconButton>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
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
