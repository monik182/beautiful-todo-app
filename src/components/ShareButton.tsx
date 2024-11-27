import { Float, IconButton } from '@chakra-ui/react'
import { SlShareAlt } from 'react-icons/sl'

interface ShareButtonProps {
  sessionId?: string | null
  type: string
  resourceId: string
}

export const ShareButton = ({ sessionId, type, resourceId }: ShareButtonProps) => {
  const handleShare = () => {
    let currentUrl = window.location.origin

    if (!sessionId) {
      return null
    }

    currentUrl = currentUrl + `/${type}?sessionId=${sessionId}&id=${resourceId}`

    if (navigator.share) {
      navigator.share({
        title: 'Check out this page',
        url: currentUrl,
      })
        .catch((error) => console.error('Error sharing: ' + error))
    } else {
      navigator.clipboard.writeText(currentUrl)
        .catch(() => {
          console.error('Failed to copy the link')
        })
    }
  }

  return (
    <Float offset="5">
      <IconButton
        aria-label="Share"
        variant="ghost"
        onClick={handleShare}
      >
        <SlShareAlt />
      </IconButton>
    </Float>
  )
}

