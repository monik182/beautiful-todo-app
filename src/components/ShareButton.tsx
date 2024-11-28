import { Float, IconButton } from '@chakra-ui/react'
import { SlShareAlt } from 'react-icons/sl'

interface ShareButtonProps {
  sessionId?: string | null
  type: string
  resourceId: string
}

export const ShareButton = ({ type, resourceId }: ShareButtonProps) => {
  const handleShare = () => {
    let currentUrl = window.location.origin

    currentUrl = currentUrl + `/${type}?id=${resourceId}&public=true&edit=true`

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

